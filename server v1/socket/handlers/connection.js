import { SOCKET_EVENTS } from '../constants.js';
import { handleUserEvents } from './user.js';
import { handleChatEvents } from './chat.js';
import { handleTypingEvents } from './typing.js';
import { handleMessageEvents } from './message.js';

export const setupConnectionHandler = (io, socket) => {
  // Initialize all event handlers
  const userHandlers = handleUserEvents(io, socket);
  const chatHandlers = handleChatEvents(io, socket);
  const typingHandlers = handleTypingEvents(io, socket);
  const messageHandlers = handleMessageEvents(io, socket);

  // Call user online handler immediately
  userHandlers.handleUserOnline();

  // Register event listeners
  socket.on(SOCKET_EVENTS.JOIN_CHAT, chatHandlers.handleJoinChat);
  socket.on(SOCKET_EVENTS.LEAVE_CHAT, chatHandlers.handleLeaveChat);
  socket.on(SOCKET_EVENTS.TYPING, typingHandlers.handleTyping);
  socket.on(SOCKET_EVENTS.STOP_TYPING, typingHandlers.handleStopTyping);
  socket.on(SOCKET_EVENTS.MARK_MESSAGES_READ, chatHandlers.handleMarkMessagesRead);
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, messageHandlers.handleSendMessage);
  socket.on(SOCKET_EVENTS.UPDATE_STATUS, userHandlers.handleStatusUpdate);
  socket.on(SOCKET_EVENTS.DISCONNECT_USER, userHandlers.handleDisconnectUser);
  socket.on(SOCKET_EVENTS.DISCONNECT, userHandlers.handleUserOffline);
};