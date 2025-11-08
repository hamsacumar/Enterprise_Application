import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

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

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`👥 User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("sendMessage", (data) => {
    console.log("💬 Received message:", data);
    io.to(data.chatId).emit("receiveMessage", data);
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