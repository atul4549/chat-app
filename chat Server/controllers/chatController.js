// controllers/chatController.js
import { getReceiverSocketId, io, sendToUser } from "../lib/socket.js";

export const createChat = async (req, res) => {
  try {
    const { participants, isGroup, groupName } = req.body;
    const currentUserId = req.user._id;

    // Create chat logic...
    const newChat = await Chat.create({
      participants: [...participants, currentUserId],
      isGroup,
      groupName,
    });

    await newChat.populate("participants", "name avatar email");

    // Notify all participants about new chat
    participants.forEach((participantId) => {
      if (participantId.toString() !== currentUserId.toString()) {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) {
          io.to(socketId).emit("new-chat", {
            chat: newChat,
            createdBy: currentUserId,
          });
        }
      }
    });

    res.status(201).json({
      success: true,
      data: newChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Example: Typing notification
export const sendTypingNotification = (chatId, senderId, isTyping) => {
  const chat = await Chat.findById(chatId);
  
  if (chat) {
    chat.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId.toString()) {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) {
          io.to(socketId).emit("user-typing", {
            chatId,
            userId: senderId,
            isTyping,
          });
        }
      }
    });
  }
};