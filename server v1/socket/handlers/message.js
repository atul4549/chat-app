import Chat from '../../models/Chat.js';
import Message from '../../models/Message.js';
import { SOCKET_EVENTS } from '../constants.js';

export const handleMessageEvents = (io, socket) => {
  const userId = socket.data.userId;

  // Handle sending messages
  const handleSendMessage = async (data) => {
    try {
      const { chatId, text, attachments = [] } = data;
      
      if (!chatId || !text) {
        socket.emit(SOCKET_EVENTS.SOCKET_ERROR, { message: "Chat ID and message text are required" });
        return;
      }

      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId,
      });

      if (!chat) {
        socket.emit(SOCKET_EVENTS.SOCKET_ERROR, { message: "Chat not found or access denied" });
        return;
      }

      const message = await Message.create({
        chat: chatId,
        sender: userId,
        text,
        attachments,
      });

      chat.lastMessage = message._id;
      chat.lastMessageAt = new Date();
      await chat.save();

      await message.populate("sender", "name avatar email");

      // Emit to chat room
      io.to(`chat:${chatId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

      // Emit notifications to participants
      for (const participantId of chat.participants) {
        io.to(`user:${participantId}`).emit(SOCKET_EVENTS.NEW_MESSAGE_NOTIFICATION, {
          message,
          chat: {
            _id: chat._id,
            name: chat.name,
            type: chat.type,
          },
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, { message: "Failed to send message" });
    }
  };

  return {
    handleSendMessage,
  };
};