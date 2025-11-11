import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: { type: String, required: true }, // external user id
    senderRole: { type: String, enum: ["Customer", "Company", "Admin", "Worker"], default: "Customer" },
    content: { type: String, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
