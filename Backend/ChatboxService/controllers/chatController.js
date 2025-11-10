import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
const COMPANY_NAME = process.env.COMPANY_NAME || "AutoServex";

// Normalize role from token (supports numeric enums and mixed-case strings)
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

export const getUserChats = async (req, res) => {
  try {
    const role = normalizeRole(req.user.role);
    let query;
    if (role === "Customer") {
      // Customer: only their single chat with Company
      query = {
        $and: [
          { "participants.userId": req.user.id },
          { "participants.role": "Company" },
        ],
      };
    } else {
      // Admin/Worker: see all chats that include a Customer participant
      query = { "participants.role": "Customer" };
    }

    const chats = await Chat.find(query).sort({ updatedAt: -1 });

    // Compute unread counts for the current viewer
    const enriched = [];
    for (const chat of chats) {
      const cObj = chat.toObject();
      let lastReadAt = null;
      let unreadQuery;
      if (role === "Customer") {
        const me = (chat.participants || []).find(
          (p) => p.role === "Customer" && p.userId === req.user.id
        );
        lastReadAt = me?.lastReadAt || null;
        unreadQuery = { chatId: chat._id, senderRole: "Company" };
      } else {
        const company = (chat.participants || []).find((p) => p.role === "Company");
        lastReadAt = company?.lastReadAt || null;
        unreadQuery = { chatId: chat._id, senderRole: "Customer" };
      }
      if (lastReadAt) unreadQuery.createdAt = { $gt: lastReadAt };
      const unreadCount = await Message.countDocuments(unreadQuery);
      // Last message preview/time
      const lastMsg = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });
      cObj.lastMessage = lastMsg?.content || "";
      cObj.lastMessageAt = lastMsg?.createdAt || chat.updatedAt;
      cObj.unreadCount = unreadCount;
      enriched.push(cObj);
    }

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const role = normalizeRole(req.user.role);
    if (role === "Customer") {
      // Ensure a single chat exists between this customer and Company
      let chat = await Chat.findOne({
        $and: [
          { "participants.userId": req.user.id },
          { "participants.role": "Company" },
        ],
      });

      if (!chat) {
        chat = new Chat({
          participants: [
            { userId: req.user.id, username: req.user.username, role: "Customer" },
            { userId: "", username: COMPANY_NAME, role: "Company" },
          ],
        });
        await chat.save();
      }

      return res.status(201).json(chat);
    }

    // Admin/Worker: for now don't create new chats arbitrarily; they will reply in existing customer chats
    return res.status(400).json({ message: "Only customers can create company chats." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    // ensure senderRole for older records
    const chat = await Chat.findById(chatId);
    let customerId = null;
    if (chat) {
      const cust = (chat.participants || []).find((p) => p.role === "Customer");
      customerId = cust?.userId || null;
    }
    const normalized = messages.map((m) => {
      const o = m.toObject();
      if (!o.senderRole) {
        o.senderRole = o.senderId && customerId && o.senderId === customerId ? "Customer" : "Company";
      }
      return o;
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderRole = normalizeRole(req.user.role) === "Customer" ? "Customer" : "Company";
    const newMessage = new Message({
      chatId,
      senderId: req.user.id,
      senderRole,
      content,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markChatRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const role = normalizeRole(req.user.role);
    if (role === "Customer") {
      const me = (chat.participants || []).find(
        (p) => p.role === "Customer" && p.userId === req.user.id
      );
      if (me) me.lastReadAt = new Date();
    } else {
      const company = (chat.participants || []).find((p) => p.role === "Company");
      if (company) company.lastReadAt = new Date();
    }
    await chat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
