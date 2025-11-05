import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// Get chats for authenticated user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId }).sort({
      updatedAt: -1,
    });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or return existing chat between authenticated user and receiverId
export const createChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;
    if (!receiverId)
      return res.status(400).json({ message: "receiverId required" });

    const existing = await Chat.findOne({
      participants: { $all: [userId, receiverId], $size: 2 },
    });
    if (existing) return res.json(existing);

    const chat = new Chat({ participants: [userId, receiverId] });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages by chatId (paginated)
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const limit = parseInt(req.query.limit || "50", 10);
    const skip = parseInt(req.query.skip || "0", 10);

    if (!mongoose.Types.ObjectId.isValid(chatId))
      return res.status(400).json({ message: "Invalid chatId" });

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Send message via REST (also used by socket)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId, content, meta } = req.body;
    if (!chatId || !content)
      return res.status(400).json({ message: "chatId & content required" });

    const message = new Message({ chatId, senderId, content, meta });
    await message.save();
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      updatedAt: new Date(),
    });

    // The socket layer will emit to rooms; but for REST-only, return message
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
