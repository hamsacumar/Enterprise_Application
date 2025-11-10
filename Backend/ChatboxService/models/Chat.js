import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: String,
        username: String,
        role: String, // 'Customer' or 'Company'
        lastReadAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
