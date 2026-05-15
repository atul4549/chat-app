import Chat from '../../models/Chat.js';
import { SOCKET_EVENTS } from '../constants.js';

export const handleChatEvents = (io, socket) => {
  const userId = socket.data.userId;
  const user = socket.data.user;

  // Handle join chat room
  const handleJoinChat = (chatId) => {
    if (!chatId) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, { message: "Chat ID is required" });
      return;
    }
    socket.join(`chat:${chatId}`);
    console.log(`${user.name} joined chat: ${chatId}`);
  };

  // Handle leave chat room
  const handleLeaveChat = (chatId) => {
    if (!chatId) return;
    socket.leave(`chat:${chatId}`);
    console.log(`${user.name} left chat: ${chatId}`);
  };

  // Handle message read receipts
  const handleMarkMessagesRead = ({ chatId, messageIds }) => {
    if (!chatId || !messageIds || !Array.isArray(messageIds)) return;
    
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.MESSAGES_READ_BY, {
      userId,
      chatId,
      messageIds,
      readAt: new Date().toISOString(),
    });
  };

  return {
    handleJoinChat,
    handleLeaveChat,
    handleMarkMessagesRead,
  };
};