import Chat from '../../models/Chat.js';
import { SOCKET_EVENTS } from '../constants.js';

export const handleTypingEvents = (io, socket) => {
  const userId = socket.data.userId;
  const user = socket.data.user;

  // Handle typing indicator
  const handleTyping = async (data) => {
    const { chatId, isTyping = true } = data;
    
    if (!chatId) return;

    const typingPayload = {
      userId,
      chatId,
      isTyping,
      userName: user.name,
      timestamp: new Date().toISOString(),
    };

    // Emit to chat room
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.TYPING, typingPayload);

    // Emit to other participants' personal rooms
    try {
      const chat = await Chat.findById(chatId);
      if (chat && chat.participants) {
        const otherParticipants = chat.participants.filter(p => p.toString() !== userId);
        otherParticipants.forEach(participantId => {
          socket.to(`user:${participantId}`).emit(SOCKET_EVENTS.TYPING, typingPayload);
        });
      }
    } catch (error) {
      console.error("Error sending typing indicator:", error);
    }
  };

  // Handle stop typing
  const handleStopTyping = ({ chatId }) => {
    if (!chatId) return;
    
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_STOP_TYPING, {
      userId,
      chatId,
    });
  };

  return {
    handleTyping,
    handleStopTyping,
  };
};