import { getReceiverSocketId } from './onlineUsers.js';

export const sendToUser = (io, userId, event, data) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};

export const sendToUsers = (io, userIds, event, data) => {
  if (!Array.isArray(userIds)) return 0;
  
  let successCount = 0;
  userIds.forEach((userId) => {
    if (sendToUser(io, userId, event, data)) {
      successCount++;
    }
  });
  return successCount;
};

export const broadcastToAll = (io, event, data, excludeUserId = null) => {
  if (excludeUserId) {
    const excludeSocketId = getReceiverSocketId(excludeUserId);
    if (excludeSocketId) {
      io.except(excludeSocketId).emit(event, data);
    } else {
      io.emit(event, data);
    }
  } else {
    io.emit(event, data);
  }
};

export const getUserSocket = (io, userId) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId && io) {
    return io.sockets.sockets.get(socketId);
  }
  return undefined;
};

export const kickExistingConnection = (io, userId, message = "You've been logged in from another device") => {
  const existingSocketId = getReceiverSocketId(userId);
  if (existingSocketId) {
    const existingSocket = io.sockets.sockets.get(existingSocketId);
    if (existingSocket) {
      existingSocket.emit(SOCKET_EVENTS.FORCE_DISCONNECT, { message });
      existingSocket.disconnect(true);
      removeOnlineUser(userId);
      return true;
    }
  }
  return false;
};