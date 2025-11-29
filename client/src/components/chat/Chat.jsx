// this file defines a Chat component for messaging functionality
// imports
import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../../context/authContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../../context/socketContext";
import { useNotificationStore } from "../../lib/notificationStore";

// Chat component definition
function Chat({ chats, initialOpenChatId = null, initialOpenReceiverId = null }) {
  // State to manage the currently open chat
  const [chat, setChat] = useState(null);
  // Getting current user and socket from context
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();
  const formRef = useRef();
  const textareaRef = useRef();

  // Function to decrease notification count
  const decrease = useNotificationStore((state) => state.decrease);

  // Effect to scroll to bottom and focus textarea when chat changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (chat && textareaRef.current) {
      try {
        textareaRef.current.focus();
      } catch (e) {}
    }
  }, [chat]);

  // Function to handle opening a chat
  const handleOpenChat = async (id, receiver) => {
    try {
      // Fetch chat data from backend
      const res = await apiRequest("/chats/" + id);

      let finalReceiver = receiver;
      // If receiver info is not provided, try to find or fetch it
      if (!finalReceiver) {
        // Try to find receiver from existing chats
        const found = chats?.find((c) => c.id === id);
        // If not found, fetch receiver data from backend
        if (found && found.receiver) {
          finalReceiver = found.receiver;
        } else {
          const receiverId = res.data.userIDs?.find((uid) => uid !== currentUser.id);
          if (receiverId) {
            try {
              // Fetch receiver user data
              const userRes = await apiRequest("/users/" + receiverId);
              finalReceiver = userRes.data;
            } catch (err) {
              console.log("Failed to fetch receiver user:", err);
            }
          }
        }
      }

      // If the chat was unseen by the current user, decrease notification count
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      // Set the open chat state with fetched data
      setChat({ ...res.data, receiver: finalReceiver });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle sending a message
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract message text from form data
    const formData = new FormData(e.target);
    const text = formData.get("text");

    // Do not send empty messages
    if (!text) return;
    // Send message to backend
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      // Emit message via socket for real-time update
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Effect to handle incoming messages via socket
  useEffect(() => {
    const read = async () => {
      try {
        // Mark chat as read in backend
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    // Listen for incoming messages
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    // Cleanup socket listener on unmount or chat change
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  // Effect to open initial chat if provided
  useEffect(() => {
    if (initialOpenChatId && chats) {
      const found = chats.find((c) => c.id === initialOpenChatId);
      if (found) {
        handleOpenChat(found.id, found.receiver);
      } else {
        handleOpenChat(initialOpenChatId, initialOpenReceiverId ? { id: initialOpenReceiverId } : null);
      }
    }
  }, [initialOpenChatId, chats]);

  // Render Chat component
  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {/* List of chat messages */}
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
                backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "var(--bg-primary)"
                  : "rgba(254,206,81,0.3)",
            }}
            // Open chat on click
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {/* Chat box for the selected chat */}
      {chat && (
        <div className="chatBox">
          {/* Chat box header */}
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          {/* Chat messages */}
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          {/* Message input form */}
          <form ref={formRef} onSubmit={handleSubmit} className="bottom">
            <textarea
              name="text"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (formRef.current && typeof formRef.current.requestSubmit === "function") {
                    formRef.current.requestSubmit();
                  } else if (formRef.current) {
                    formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
                  }
                }
              }}
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
