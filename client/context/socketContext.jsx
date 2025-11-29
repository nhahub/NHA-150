// this file sets up a Socket.IO context for real-time communication
// imports
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

// create SocketContext
export const SocketContext = createContext();

// SocketContext provider component
export const SocketContextProvider = ({ children }) => {

  // get currentUser from AuthContext
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  // effect to initialize and clean up socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) return;
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // effect to notify server of new user connection
  useEffect(() => {
  currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  // provide socket instance to children components
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};