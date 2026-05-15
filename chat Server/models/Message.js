import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
        senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// indexes for faster queries
messageSchema.index({ chat: 1, createdAt: 1 }); // oldest one first
// 1 - asc
// -1 -> desc

export const Message = mongoose.model("Message", messageSchema);

// export default Message;
