import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      "participants.userId": req.user.id,
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { receiverId, receiverUsername } = req.body;

    let chat = await Chat.findOne({
      "participants.userId": { $all: [req.user.id, receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [
          { userId: req.user.id, username: req.user.username },
          { userId: receiverId, username: receiverUsername },
        ],
      });
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const newMessage = new Message({
      chatId,
      senderId: req.user.id,
      senderUsername: req.user.username,
      content,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
