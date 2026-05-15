// Store online users in memory: userId -> socketId
export const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeOnlineUser = (userId) => {
  onlineUsers.delete(userId);
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId?.toString());
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

export const getOnlineUsersWithDetails = () => {
  const users = [];
  for (const [userId, socketId] of onlineUsers.entries()) {
    users.push({ userId, socketId });
  }
  return users;
};

export const getOnlineUsersCount = () => {
  return onlineUsers.size;
};