import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // external user ids (from Auth)
    lastMessage: { type: String },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });

export default mongoose.model("Chat", ChatSchema);
