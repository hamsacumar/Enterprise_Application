import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: { type: String, required: true }, // external user id
    content: { type: String, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
