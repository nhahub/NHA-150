// this file contains routes for testing access control
// imports

import express from "express"
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.contoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Route that requires the user to be logged in
router.get('/should-be-logged-in', verifyToken, shouldBeLoggedIn);

// Route that requires the user to be an admin
router.get('/should-be-admin', shouldBeAdmin);

export default router;