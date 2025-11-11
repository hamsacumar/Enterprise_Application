import jwt from "jsonwebtoken";
import axios from "axios";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export function setupSocket(io) {
  // Socket auth middleware for handshake
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization
          ? socket.handshake.headers.authorization.split(" ")[1]
          : null);
      if (!token) return next(new Error("No token"));

      // verify with Auth service
      const resp = await axios.post(
        AUTH_SERVICE_URL,
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp?.data?.valid) return next(new Error("Invalid token"));

      socket.user = resp.data.user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err.response?.data || err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user?.id;
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`Socket connected for user ${userId} id=${socket.id}`);
    }

    socket.on("joinChat", ({ chatId }) => {
      if (chatId) socket.join(`chat:${chatId}`);
    });

    // payload { chatId, content, meta? }
    socket.on("sendMessage", async (payload) => {
      try {
        const senderId = socket.user.id;
        const { chatId, content, meta } = payload;
        if (!chatId || !content) return;

        const message = new Message({ chatId, senderId, content, meta });
        await message.save();
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: content,
          updatedAt: new Date(),
        });

        // emit to all participants in chat room
        io.to(`chat:${chatId}`).emit("message", message);

        // also emit to individual user rooms
        // fetch chat participants to emit to user:<id> rooms (optional)
        const chat = await Chat.findById(chatId);
        if (chat?.participants?.length) {
          chat.participants.forEach((pid) =>
            io
              .to(`user:${pid}`)
              .emit("conversation:update", { chatId, lastMessage: content })
          );
        }
      } catch (err) {
        console.error("socket sendMessage error:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected for user ${userId}: ${reason}`);
    });
  });
}
