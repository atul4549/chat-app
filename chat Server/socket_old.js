// import { Server as SocketServer } from "socket.io";
// import jwt from "jsonwebtoken";
// import { Message } from "./models/Message.js";
// import { Chat } from "./models/Chat.js";
// import { user as User } from "./models/User.js";

// // Store online users in memory: userId -> socketId
// export const onlineUsers = new Map();

// export const initializeSocket = (httpServer) => {
//   const allowedOrigins = [
//     "http://localhost:8081", // Expo mobile
//     "http://localhost:5173", // Vite web dev
//     process.env.FRONTEND_URL, // production
//   ].filter(Boolean);

//   const io = new SocketServer(httpServer, { 
//     cors: { 
//       origin: allowedOrigins,
//       credentials: true,
//       methods: ["GET", "POST"],
//        pingTimeout: 60000, // 60 seconds
//     pingInterval: 25000, // 25 seconds
//     } 
//   });

//   // Authentication middleware
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
      
//       if (!token) {
//         return next(new Error("Authentication error: No token provided"));
//       }

//       // Verify JWT token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
//       // Find user by ID from token
//       const user = await User.findById(decoded.userId).select("-password");
      
//       if (!user) {
//         return next(new Error("Authentication error: User not found"));
//       }
      
//       // Check if user is already connected (kick old connection)
//       const existingSocketId = onlineUsers.get(user._id.toString());
//       if (existingSocketId) {
//         const existingSocket = io.sockets.sockets.get(existingSocketId);
//         if (existingSocket) {
//           existingSocket.emit("force-disconnect", {
//             message: "You've been logged in from another device",
//           });
//           existingSocket.disconnect(true);
//         }
//       }

//       // Attach user data to socket
//       socket.data.userId = user._id.toString();
//       socket.data.user = user;
      
//       next();
//     } catch (error) {
//       if (error.name === 'JsonWebTokenError') {
//         return next(new Error("Authentication error: Invalid token"));
//       }
//       if (error.name === 'TokenExpiredError') {
//         return next(new Error("Authentication error: Token expired"));
//       }
//       next(new Error("Authentication error: " + error.message));
//     }
//   });

//   io.on("connection", (socket) => {
//     const userId = socket.data.userId;
//     const user = socket.data.user;
//     console.log(`✅ User connected: ${userId}`);
//     console.log(`✅ User connected: ${user.name} (${userId})`);

//     // Send list of currently online users to the newly connected client
//     socket.emit("online-users", { 
//       userIds: Array.from(onlineUsers.keys()),
//       users: getOnlineUsers(), 
//     });

//     // Store user in the onlineUsers map
//     onlineUsers.set(userId, socket.id);

//     // Notify others that this user is online
//     socket.broadcast.emit("user-online", { userId });

//     // Join user's personal room
//     socket.join(`user:${userId}`);

//     // Auto-join all user's chats
//     joinUserChats(socket, userId);

//     // Handle joining a specific chat
//     socket.on("join-chat", (chatId) => {
//       socket.join(`chat:${chatId}`);
//       console.log(`User ${userId} joined chat: ${chatId}`);
//     });

//     // Handle leaving a specific chat
//     socket.on("leave-chat", (chatId) => {
//       socket.leave(`chat:${chatId}`);
//       console.log(`User ${userId} left chat: ${chatId}`);
//     });

//     // Handle sending messages
//     socket.on("send-message", async (data, callback) => {
//       try {
//         const { chatId, text, messageType = "text", mediaUrl } = data;

//         // Validate input
//         if (!chatId || !text) {
//           socket.emit("socket-error", { message: "Chat ID and text are required" });
//           return;
//         }

//         // Verify user is participant of the chat
//         const chat = await Chat.findOne({
//           _id: chatId,
//           participants: userId,
//         });

//         if (!chat) {
//           socket.emit("socket-error", { message: "Chat not found or access denied" });
//           return;
//         }

//         // Create message
//         const message = await Message.create({
//           chat: chatId,
//           sender: userId,
//           text,
//           messageType,
//           mediaUrl,
//         });

//         // Update chat's last message
//         chat.lastMessage = message._id;
//         chat.lastMessageAt = new Date();
//         await chat.save();

//         // Populate sender info
//         await message.populate("sender", "name avatar email");

//         // Emit to everyone in the chat room including sender
//         io.to(`chat:${chatId}`).emit("new-message", message);

//         // Also emit to participants' personal rooms (for notifications/chat list)
//         chat.participants.forEach((participantId) => {
//           io.to(`user:${participantId}`).emit("chat-updated", {
//             chatId,
//             lastMessage: message,
//           });
//         });

//         // Acknowledge the sender (optional)
//         if (typeof callback === "function") {
//           callback({ success: true, message });
//         }

//       } catch (error) {
//         console.error("Error sending message:", error);
//         socket.emit("socket-error", { 
//           message: "Failed to send message",
//           error: error.message 
//         });
        
//         if (typeof callback === "function") {
//           callback({ success: false, error: error.message });
//         }
//       }
//     });

//     // Handle typing indicator
//     socket.on("typing", async (data) => {
//       const { chatId, isTyping } = data;
      
//       const typingPayload = {
//         userId,
//         chatId,
//         isTyping,
//         userName: socket.data.user?.name,
//       };

//       // Emit to chat room (for users currently viewing the chat)
//       socket.to(`chat:${chatId}`).emit("typing", typingPayload);
//     });

//     // Handle marking messages as read
//     socket.on("mark-read", async (data) => {
//       try {
//         const { chatId } = data;
        
//         // Update read status for all messages in the chat
//         await Message.updateMany(
//           {
//             chat: chatId,
//             sender: { $ne: userId },
//             readBy: { $ne: userId },
//           },
//           {
//             $push: { readBy: userId },
//           }
//         );

//         // Notify other participants
//         socket.to(`chat:${chatId}`).emit("messages-read", {
//           chatId,
//           readBy: userId,
//         });
//       } catch (error) {
//         console.error("Error marking messages as read:", error);
//       }
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       console.log(`❌ User disconnected: ${userId}`);
//       onlineUsers.delete(userId);

//       // Notify others that user is offline
//       socket.broadcast.emit("user-offline", { userId });
//     });
//   });

//   return io;
// };

// // Helper function to auto-join user's chats on connection
// async function joinUserChats(socket, userId) {
//   try {
//     const userChats = await Chat.find({ participants: userId });
//     userChats.forEach((chat) => {
//       socket.join(`chat:${chat._id}`);
//     });
//     console.log(`User ${userId} auto-joined ${userChats.length} chats`);
//   } catch (error) {
//     console.error("Error joining user chats:", error);
//   }
// }

