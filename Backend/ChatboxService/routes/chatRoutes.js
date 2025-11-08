import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getUserChats,
  createChat,
  getMessages,
  sendMessage,
  markChatRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/chats", authenticateUser, getUserChats);
router.post("/chats", authenticateUser, createChat);
router.get("/messages/:chatId", authenticateUser, getMessages);
router.post("/messages", authenticateUser, sendMessage);
router.post("/chats/:chatId/read", authenticateUser, markChatRead);

export default router;
