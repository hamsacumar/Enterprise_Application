import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getUserChats,
  createChat,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/chats", authenticateUser, getUserChats);
router.post("/chats", authenticateUser, createChat);
router.get("/messages/:chatId", authenticateUser, getMessages);
router.post("/messages", authenticateUser, sendMessage);

export default router;
