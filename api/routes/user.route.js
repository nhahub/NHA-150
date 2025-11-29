// this file contains routes for user-related operations
// imports

import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";    // middlware to verify JWT token
import { deleteUser, getUser, getUsers, updateUser,profilePosts, getNotificationNumber, getAgents } from "../controllers/user.controller.js";
import { savePost } from "../controllers/post.controller.js";    

const router = express.Router();


router.get('/',getUsers);                             // Get all users
router.get('/agents', getAgents);                     // Get all agents
router.put('/:id',verifyToken, updateUser);           // Update a specific user by ID
router.delete('/:id',verifyToken, deleteUser);        // Delete a specific user by ID
router.get('/profilePosts',verifyToken, profilePosts); // Get posts of the authenticated user's profile
router.post("/save", verifyToken, savePost);            // Save a post for the authenticated user
router.get("/notification", verifyToken, getNotificationNumber);  // Get the number of notifications 
export default router;