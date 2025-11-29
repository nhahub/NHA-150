// this file contains routes for message-related operations
// imports

import express from "express";
import {
  addMessage
} from "../controllers/message.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";  // Middleware to verify JWT token

const router = express.Router();

router.post("/:chatId", verifyToken, addMessage); // Add a new message to a specific chat

export default router;