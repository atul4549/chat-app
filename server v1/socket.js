// import jwt from 'jsonwebtoken';
// import { getCorsOrigins } from "./middleware/cors.js";
// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
// import Session from './models/Session.js'; // Add missing import
// import User from './models/User.js'; // Add missing import
// import Chat from './models/Chat.js'; // Add missing import
// import Message from './models/Message.js'; // Add missing import

// // Store online users in memory: userId -> socketId
// export const onlineUsers = new Map();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: getCorsOrigins(),
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   },
//   pingTimeout: 60000, // 60 seconds
//   pingInterval: 25000, // 25 seconds
// });

// // Socket.IO authentication middleware
// io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
  
//   if (!token) {
//     return next(new Error("Authentication error: No token provided"));
//   }

//   try {
//     // Verify JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Check if session exists and is valid
//     const session = await Session.findOne({ 
//       token,  
//       _id: decoded.sessionId,
//       userId: decoded.userId,
//       expiresAt: { $gt: new Date() },
//       isActive: true
//     }).populate('user');
    
//     if (!session) {
//       return next(new Error("Session revoked or expired"));
//     }

//     if (!session || !session.user) {
//       return next(new Error("Invalid or expired token"));
//     }

//     // Fetch user from DB
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return next(new Error("User not found"));
//     }

//     // Check if user is already connected (kick old connection)
//     const existingSocketId = onlineUsers.get(user._id.toString());
//     if (existingSocketId) {
//       const existingSocket = io.sockets.sockets.get(existingSocketId);
//       if (existingSocket) {
//         existingSocket.emit("force-disconnect", {
//           message: "You've been logged in from another device",
//         });
//         existingSocket.disconnect(true);
//         onlineUsers.delete(user._id.toString());
//       }
//     }

//     // Attach user data to socket
//     socket.data.userId = user._id.toString();
//     socket.data.user = user;
//     socket.data.sessionId = session._id;
    
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return next(new Error("Authentication error: Invalid token"));
//     }
//     if (error.name === "TokenExpiredError") {
//       return next(new Error("Authentication error: Token expired"));
//     }
//     console.error("Socket authentication error:", error);
//     next(new Error(`Authentication error: ${error.message}`));
//   }
// });

// // Socket connection handler
// io.on("connection", (socket) => {
//   const userId = socket.data.userId;
//   const user = socket.data.user;
  
//   console.log(`✅ User connected: ${user?.name || userId} (${userId}) - Socket ID: ${socket.id}`);

//   // Send list of currently online users to the newly connected client
//   socket.emit("online-users", {
//     users: getOnlineUsers(),
//   });
  
//   // Store user in the onlineUsers map
//   onlineUsers.set(userId, socket.id);

//   // Notify others that this user is online
//   socket.broadcast.emit("user-online", { userId });
//   socket.broadcast.emit("user-connected", {
//     userId,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//     },
//   });

//   // Join user's personal room
//   socket.join(`user:${userId}`);
  
//   // Update user's online status in database
//   User.findByIdAndUpdate(userId, {
//     lastSeen: new Date(),
//     isOnline: true,
//   }).catch(err => console.error("Failed to update user status:", err));

//   // Handle join chat room
//   socket.on("join-chat", (chatId) => {
//     if (!chatId) {
//       socket.emit("socket-error", { message: "Chat ID is required" });
//       return;
//     }
//     socket.join(`chat:${chatId}`);
//     console.log(`${user.name} joined chat: ${chatId}`);
//   });

//   // Handle leave chat room
//   socket.on("leave-chat", (chatId) => {
//     if (!chatId) return;
//     socket.leave(`chat:${chatId}`);
//     console.log(`${user.name} left chat: ${chatId}`);
//   });

//   // Handle typing indicator
//   socket.on("typing", async (data) => {
//     const { chatId, isTyping = true } = data;
    
//     if (!chatId) return;

//     const typingPayload = {
//       userId,
//       chatId,
//       isTyping,
//       userName: user.name,
//       timestamp: new Date().toISOString(),
//     };

//     // Emit to chat room (for users inside the chat)
//     socket.to(`chat:${chatId}`).emit("typing", typingPayload);

//     // Also emit to other participant's personal room (for chat list view)
//     try {
//       const chat = await Chat.findById(chatId);
//       if (chat && chat.participants) {
//         const otherParticipants = chat.participants.filter(p => p.toString() !== userId);
//         otherParticipants.forEach(participantId => {
//           socket.to(`user:${participantId}`).emit("typing", typingPayload);
//         });
//       }
//     } catch (error) {
//       // Silently fail - typing indicator is not critical
//       console.error("Error sending typing indicator:", error);
//     }
//   });

//   // Handle stop typing
//   socket.on("stop-typing", ({ chatId }) => {
//     if (!chatId) return;
    
//     socket.to(`chat:${chatId}`).emit("user-stop-typing", {
//       userId,
//       chatId,
//     });
//   });

//   // Handle message read receipts
//   socket.on("mark-messages-read", ({ chatId, messageIds }) => {
//     if (!chatId || !messageIds || !Array.isArray(messageIds)) return;
    
//     socket.to(`chat:${chatId}`).emit("messages-read-by", {
//       userId,
//       chatId,
//       messageIds,
//       readAt: new Date().toISOString(),
//     });
//   });

//   // Handle user status update
//   socket.on("update-status", (status) => {
//     const validStatuses = ["online", "away", "busy", "offline"];
//     if (!validStatuses.includes(status)) {
//       socket.emit("socket-error", { message: "Invalid status" });
//       return;
//     }
    
//     socket.broadcast.emit("user-status-changed", {
//       userId,
//       status,
//     });
//   });

//   // Handle sending messages
//   socket.on("send-message", async (data) => {
//     try {
//       const { chatId, text, attachments = [] } = data;
      
//       if (!chatId || !text) {
//         socket.emit("socket-error", { message: "Chat ID and message text are required" });
//         return;
//       }

//       const chat = await Chat.findOne({
//         _id: chatId,
//         participants: userId,
//       });

//       if (!chat) {
//         socket.emit("socket-error", { message: "Chat not found or access denied" });
//         return;
//       }

//       const message = await Message.create({
//         chat: chatId,
//         sender: userId,
//         text,
//         attachments,
//       });

//       chat.lastMessage = message._id;
//       chat.lastMessageAt = new Date();
//       await chat.save();

//       await message.populate("sender", "name avatar email");

//       // Emit to chat room (for users inside the chat)
//       io.to(`chat:${chatId}`).emit("new-message", message);

//       // Also emit to participants' personal rooms (for chat list view)
//       for (const participantId of chat.participants) {
//         io.to(`user:${participantId}`).emit("new-message-notification", {
//           message,
//           chat: {
//             _id: chat._id,
//             name: chat.name,
//             type: chat.type,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       socket.emit("socket-error", { message: "Failed to send message" });
//     }
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${user?.name || userId} (${userId}) - Socket ID: ${socket.id}`);
    
//     onlineUsers.delete(userId);
    
//     // Update user's last seen and online status
//     User.findByIdAndUpdate(userId, {
//       lastSeen: new Date(),
//       isOnline: false,
//     }).catch(err => console.error("Failed to update user offline status:", err));

//     // Notify others that user is offline
//     socket.broadcast.emit("user-offline", { 
//       userId,
//       lastSeen: new Date(),
//     });
//   });

//   // Handle manual disconnect request
//   socket.on("disconnect-user", () => {
//     socket.disconnect(true);
//   });
// });

// // Helper functions
// export function getReceiverSocketId(userId) {
//   return onlineUsers.get(userId);
// }

// export const isUserOnline = (userId) => {
//   return onlineUsers.has(userId.toString());
// };

// export const getOnlineUsers = () => {
//   return Array.from(onlineUsers.keys());
// };

// export const getUserSocket = (userId) => {
//   const socketId = getReceiverSocketId(userId);
//   if (socketId && io) {
//     return io.sockets.sockets.get(socketId);
//   }
//   return undefined;
// };

// export const sendToUser = (userId, event, data) => {
//   const socketId = getReceiverSocketId(userId);
//   if (socketId && io) {
//     io.to(socketId).emit(event, data);
//     return true;
//   }
//   return false;
// };

// export const sendToUsers = (userIds, event, data) => {
//   if (!Array.isArray(userIds)) return false;
  
//   let successCount = 0;
//   userIds.forEach((userId) => {
//     if (sendToUser(userId, event, data)) {
//       successCount++;
//     }
//   });
//   return successCount;
// };

// export const broadcastToAll = (event, data, excludeUserId = null) => {
//   if (excludeUserId) {
//     const excludeSocketId = getReceiverSocketId(excludeUserId);
//     if (excludeSocketId) {
//       io.except(excludeSocketId).emit(event, data);
//     } else {
//       io.emit(event, data);
//     }
//   } else {
//     io.emit(event, data);
//   }
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.IO not initialized!");
//   }
//   return io;
// };

// // Error handling middleware should be after routes
// app.use(notFoundHandler);
// app.use(errorHandler);

// export { io, app, server };