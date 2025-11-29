// this file contains routes for post-related operations
// imports
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";  // Middleware to verify JWT token
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();


router.get('/', getPosts)  // Get all posts
router.get('/:id', getPost)  // Get a specific post by ID
router.post('/', verifyToken, addPost)  // Add a new post
router.put('/:id',verifyToken, updatePost)  // Update a specific post by ID
router.delete('/:id', verifyToken,deletePost)  // Delete a specific post by ID

export default router;