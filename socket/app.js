// this file sets up a Socket.IO server for real-time communication
// imports
import { Server } from "socket.io";

// Socket.IO server setup
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

// in-memory array to track online users
let onlineUser = [];

// function to add a user to the online users list
const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

// function to remove a user from the online users list
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

// function to get a user by their userId
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// Socket.IO event listeners
io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // listen for sendMessage event and forward the message to the intended receiver
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  // handle user disconnection
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
  
});

// start the Socket.IO server on port 4000
io.listen("4000");
