import { addOnlineUser, removeOnlineUser, getOnlineUsers } from '../utils/onlineUsers.js';
import { sendToUser, broadcastToAll } from '../utils/helpers.js';
import { SOCKET_EVENTS, USER_STATUS } from '../constants.js';
import User from '../../models/User.js';

export const handleUserEvents = (io, socket) => {
  const userId = socket.data.userId;
  const user = socket.data.user;

  // Handle user online status
  const handleUserOnline = async () => {
    console.log(`✅ User connected: ${user?.name || userId} (${userId}) - Socket ID: ${socket.id}`);

    // Send list of currently online users
    socket.emit(SOCKET_EVENTS.ONLINE_USERS, {
      users: getOnlineUsers(),
    });
    
    // Store user in the onlineUsers map
    addOnlineUser(userId, socket.id);

    // Notify others that this user is online
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
    socket.broadcast.emit(SOCKET_EVENTS.USER_CONNECTED, {
      userId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

    // Join user's personal room
    socket.join(`user:${userId}`);
    
    // Update user's online status in database
    try {
      await User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
        isOnline: true,
      });
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  // Handle user offline
  const handleUserOffline = async () => {
    console.log(`❌ User disconnected: ${user?.name || userId} (${userId}) - Socket ID: ${socket.id}`);
    
    removeOnlineUser(userId);
    
    // Update user's last seen and online status
    try {
      await User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
        isOnline: false,
      });
    } catch (err) {
      console.error("Failed to update user offline status:", err);
    }

    // Notify others that user is offline
    socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, { 
      userId,
      lastSeen: new Date(),
    });
  };

  // Handle user status update
  const handleStatusUpdate = (status) => {
    const validStatuses = Object.values(USER_STATUS);
    if (!validStatuses.includes(status)) {
      socket.emit(SOCKET_EVENTS.SOCKET_ERROR, { message: "Invalid status" });
      return;
    }
    
    socket.broadcast.emit(SOCKET_EVENTS.USER_STATUS_CHANGED, {
      userId,
      status,
    });
  };

  // Handle manual disconnect
  const handleDisconnectUser = () => {
    socket.disconnect(true);
  };

  return {
    handleUserOnline,
    handleUserOffline,
    handleStatusUpdate,
    handleDisconnectUser,
  };
};