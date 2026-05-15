// lib/socket.js
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import { user as User } from "./models/User.js";

// Store online users in memory: userId -> socketId
export const onlineUsers = new Map();

// Store io instance
export let io;

/**
 * Get socket ID of a receiver/user
 * @param {string} receiverId - The MongoDB user ID
 * @returns {string|undefined} - Socket ID if user is online, undefined otherwise
 */
export const getReceiverSocketId = (receiverId) => {
  return onlineUsers.get(receiverId.toString());
};

/**
 * Check if a user is online
 * @param {string} userId - The MongoDB user ID
 * @returns {boolean}
 */
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

/**
 * Get all online users
 * @returns {string[]} - Array of online user IDs
 */
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

/**
 * Get socket instance by user ID
 * @param {string} userId - The MongoDB user ID
 * @returns {Socket|undefined} - Socket instance if user is online
 */
export const getUserSocket = (userId) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId && io) {
    return io.sockets.sockets.get(socketId);
  }
  return undefined;
};

/**
 * Send notification to specific user
 * @param {string} userId - The MongoDB user ID
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
export const sendToUser = (userId, event, data) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};

/**
 * Send notification to multiple users
 * @param {string[]} userIds - Array of user IDs
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
export const sendToUsers = (userIds, event, data) => {
  userIds.forEach((userId) => {
    sendToUser(userId, event, data);
  });
};

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {SocketServer} - Socket.IO server instance
 */
export const initializeSocket = (httpServer) => {
  const allowedOrigins = [
    "http://localhost:8081", // Expo mobile
    "http://localhost:5173", // Vite web dev
    process.env.FRONTEND_URL, // production
  ].filter(Boolean);

  io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Check if user is already connected (kick old connection)
      const existingSocketId = onlineUsers.get(user._id.toString());
      if (existingSocketId) {
        const existingSocket = io.sockets.sockets.get(existingSocketId);
        if (existingSocket) {
          existingSocket.emit("force-disconnect", {
            message: "You've been logged in from another device",
          });
          existingSocket.disconnect(true);
        }
      }

      // Attach user data to socket
      socket.data.userId = user._id.toString();
      socket.data.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return next(new Error("Authentication error: Invalid token"));
      }
      if (error.name === "TokenExpiredError") {
        return next(new Error("Authentication error: Token expired"));
      }
      next(new Error("Authentication error: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    const user = socket.data.user;

    console.log(`✅ User connected: ${user.name} (${userId})`);

    // Store user in the onlineUsers map
    onlineUsers.set(userId, socket.id);

    // Send current online users to the newly connected client
    socket.emit("online-users", {
      users: getOnlineUsers(),
    });

    // Notify others that this user is online
    socket.broadcast.emit("user-connected", {
      userId,
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    });

    // Join user's personal room for direct notifications
    socket.join(`user:${userId}`);

    // Update user's last seen
    User.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
      isOnline: true,
    }).catch(console.error);

    // Handle join chat room
    socket.on("join-chat", (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`${user.name} joined chat: ${chatId}`);
    });

    // Handle leave chat room
    socket.on("leave-chat", (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`${user.name} left chat: ${chatId}`);
    });

    // Handle typing indicator
    socket.on("typing", ({ chatId, isTyping }) => {
      const typingPayload = {
        userId,
        userName: user.name,
        chatId,
        isTyping,
      };

      // Broadcast to chat room (excluding sender)
      socket.to(`chat:${chatId}`).emit("user-typing", typingPayload);
    });

    // Handle stop typing
    socket.on("stop-typing", ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit("user-stop-typing", {
        userId,
        chatId,
      });
    });

    // Handle message read receipts
    socket.on("mark-messages-read", ({ chatId, messageIds }) => {
      socket.to(`chat:${chatId}`).emit("messages-read-by", {
        userId,
        chatId,
        messageIds,
      });
    });

    // Handle user status update
    socket.on("update-status", (status) => {
      socket.broadcast.emit("user-status-changed", {
        userId,
        status,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${user.name} (${userId})`);

      onlineUsers.delete(userId);

      // Update user's last seen
      User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
        isOnline: false,
      }).catch(console.error);

      // Notify others that user is offline
      socket.broadcast.emit("user-disconnected", {
        userId,
        lastSeen: new Date(),
      });
    });

    // Handle manual disconnect request
    socket.on("disconnect-user", () => {
      socket.disconnect(true);
    });
  });

  return io;
};

/**
 * Get socket server instance
 * @returns {SocketServer}
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};