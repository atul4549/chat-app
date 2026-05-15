import jwt from 'jsonwebtoken';
import Session from '../../models/Session.js';
import User from '../../models/User.js';
import { onlineUsers, addOnlineUser, removeOnlineUser } from '../utils/onlineUsers.js';
import { kickExistingConnection } from '../utils/helpers.js';
import { SOCKET_EVENTS } from '../constants.js';

export const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if session exists and is valid
    const session = await Session.findOne({ 
      token,  
      _id: decoded.sessionId,
      userId: decoded.userId,
      expiresAt: { $gt: new Date() },
      isActive: true
    }).populate('user');
    
    if (!session) {
      return next(new Error("Session revoked or expired"));
    }

    if (!session || !session.user) {
      return next(new Error("Invalid or expired token"));
    }

    // Fetch user from DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error("User not found"));
    }

    // Check if user is already connected (kick old connection)
    kickExistingConnection(socket.io, user._id.toString());

    // Attach user data to socket
    socket.data.userId = user._id.toString();
    socket.data.user = user;
    socket.data.sessionId = session._id;
    
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new Error("Authentication error: Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication error: Token expired"));
    }
    console.error("Socket authentication error:", error);
    next(new Error(`Authentication error: ${error.message}`));
  }
};