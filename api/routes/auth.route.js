// this file contains routes for authentication-related operations
// imports
import express from "express"
import { register, login, logout } from "../controllers/auth.controlers.js"
const router = express.Router();

router.post('/register', register); // User registration route
router.post('/login', login); // User login route
router.post('/logout', logout); // User logout route

export default router;