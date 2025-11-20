import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { deleteUser, getUser, getUsers, updateUser,profilePosts, getNotificationNumber, getAgents } from "../controllers/user.controller.js";
import { savePost } from "../controllers/post.controller.js";
const router = express.Router();


router.get('/',getUsers);
router.get('/agents', getAgents);
router.put('/:id',verifyToken, updateUser);
router.delete('/:id',verifyToken, deleteUser);
router.get('/profilePosts',verifyToken, profilePosts);
router.post("/save", verifyToken, savePost);
router.get("/notification", verifyToken, getNotificationNumber);
export default router;