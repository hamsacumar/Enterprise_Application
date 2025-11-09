import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

// Connect MongoDB
connectDB();

// API routes
app.use("/api/chat", chatRoutes);

// Create HTTP + WebSocket server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake?.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    const resp = await axios.post(process.env.AUTH_SERVICE_URL, { token });
    if (!resp?.data?.userId) return next(new Error("Unauthorized"));
    socket.data.user = {
      id: resp.data.userId,
      username: resp.data.username,
      role: resp.data.role,
    };
    return next();
  } catch (e) {
    return next(new Error("Unauthorized"));
  }
});

const normalizeRole = (role) => {
  if (typeof role === "number") {
    return role === 0 ? "Customer" : role === 1 ? "Worker" : "Admin";
  }
  if (typeof role === "string") {
    const t = role.trim();
    if (/^\d+$/.test(t)) {
      const n = parseInt(t, 10);
      return n === 0 ? "Customer" : n === 1 ? "Worker" : "Admin";
    }
    const l = t.toLowerCase();
    return l === "customer" ? "Customer" : l === "worker" ? "Worker" : "Admin";
  }
  return "Customer";
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`👥 User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("sendMessage", (data) => {
    const user = socket.data?.user || {};
    const roleNorm = normalizeRole(user.role);
    const senderRole = roleNorm === "Customer" ? "Customer" : "Company";
    const payload = {
      chatId: data.chatId,
      content: data.content,
      senderRole,
      senderId: user.id || undefined,
      createdAt: new Date().toISOString(),
    };
    console.log("💬 Received message:", payload);
    io.to(payload.chatId).emit("receiveMessage", payload);
    io.emit("conversationUpdate", {
      chatId: payload.chatId,
      lastMessage: payload.content,
      lastMessageAt: payload.createdAt,
      senderRole: payload.senderRole,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("🚀 Server is running with Socket.io!");
});

// ✅ Listen on the *same* server as Socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;