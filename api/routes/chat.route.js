// this file contains routes for chat-related operations
// imports
import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";  // Middleware to verify JWT token

const router = express.Router();

router.get("/", verifyToken, getChats);  // Get all chats for the authenticated user
router.get("/:id", verifyToken, getChat);  // Get a specific chat by ID
router.post("/", verifyToken, addChat);    // Add a specific chat by ID
router.put("/read/:id", verifyToken, readChat); // Mark a chat as read by ID

export default router;