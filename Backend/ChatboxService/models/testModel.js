// models/testModel.js
import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      default: 4,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Test", // Force collection name to be "Test"
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;
