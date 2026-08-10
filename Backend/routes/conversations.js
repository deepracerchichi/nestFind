import express from "express";
import { startConversation, getConversations, getMessages } from "../controllers/conversationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, startConversation);
router.get("/", verifyToken, getConversations);
router.get("/:id/messages", verifyToken, getMessages);

export default router;
