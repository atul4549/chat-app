import userStore from '../models/userStore.js';
import chatService from '../services/chatService.js';
import { CONSTANTS } from '../utils/constants.js';
import { isValidRoomName } from '../utils/helpers.js';

class ChatController {
    handleUserJoin(socket, io) {
        return (userData, callback) => {
            try {
                const { username, userId } = userData;
                
                // Store user info
                const user = userStore.addUser(socket.id, { userId, username });
                
                // Broadcast to all other users that someone joined
                const joinPayload = chatService.createUserJoinedPayload(username, userId);
                socket.broadcast.emit(CONSTANTS.EVENTS.USER_JOINED, joinPayload);
                
                // Send current online users to the new user
                const onlineUsers = chatService.getOnlineUsers();
                
                if (callback && typeof callback === 'function') {
                    callback({ success: true, onlineUsers, user });
                }
                
                console.log(`📝 User joined: ${username} (${socket.id})`);
                console.log(`Online users: ${onlineUsers.length}`);
            } catch (error) {
                console.error(`Error in user-join: ${error.message}`);
                if (callback && typeof callback === 'function') {
                    callback({ success: false, error: error.message });
                }
            }
        };
    }

    handleSendMessage(socket, io) {
        return (messageData, callback) => {
            try {
                const { message, username, userId, room } = messageData;
                
                if (!message || !username) {
                    throw new Error('Message and username are required');
                }
                
                const messagePayload = chatService.createMessagePayload(message, username, userId, room);
                
                // If room specified, send to room only
                if (room && room !== CONSTANTS.ROOMS.GENERAL) {
                    socket.to(room).emit(CONSTANTS.EVENTS.RECEIVE_MESSAGE, messagePayload);
                    socket.emit(CONSTANTS.EVENTS.RECEIVE_MESSAGE, messagePayload);
                } else {
                    // Broadcast to all connected clients (including sender)
                    io.emit(CONSTANTS.EVENTS.RECEIVE_MESSAGE, messagePayload);
                }
                
                if (callback && typeof callback === 'function') {
                    callback({ success: true, messageId: messagePayload.id });
                }
                console.log(`💬 Message from ${username}: ${message.substring(0, 50)}`);
            } catch (error) {
                console.error(`Error in send-message: ${error.message}`);
                if (callback && typeof callback === 'function') {
                    callback({ success: false, error: error.message });
                }
            }
        };
    }

    handleTypingStart(socket) {
        return (data) => {
            if (data && data.username) {
                const typingPayload = chatService.createTypingPayload(data.username, data.userId, true);
                socket.broadcast.emit(CONSTANTS.EVENTS.USER_TYPING, typingPayload);
            }
        };
    }

    handleTypingStop(socket) {
        return (data) => {
            if (data && data.username) {
                const typingPayload = chatService.createTypingPayload(data.username, data.userId, false);
                socket.broadcast.emit(CONSTANTS.EVENTS.USER_TYPING, typingPayload);
            }
        };
    }

    handlePrivateMessage(socket) {
        return ({ toUserId, message, fromUsername, fromUserId }) => {
            const targetSocketId = chatService.findTargetSocketId(toUserId);
            
            if (targetSocketId) {
                const messagePayload = chatService.createPrivateMessagePayload(fromUsername, fromUserId, message);
                socket.to(targetSocketId).emit(CONSTANTS.EVENTS.PRIVATE_MESSAGE, messagePayload);
                socket.emit(CONSTANTS.EVENTS.PRIVATE_MESSAGE_SENT, { 
                    success: true,
                    to: toUserId,
                    message 
                });
            } else {
                socket.emit(CONSTANTS.EVENTS.PRIVATE_MESSAGE_SENT, { 
                    success: false, 
                    error: 'User is offline' 
                });
            }
        };
    }

    handleJoinRoom(socket) {
        return (roomName, callback) => {
            if (isValidRoomName(roomName)) {
                socket.join(roomName);
                const user = userStore.getUser(socket.id);
                if (callback && typeof callback === 'function') {
                    callback({ success: true, room: roomName });
                }
                console.log(`🏠 ${user?.username || 'User'} joined room: ${roomName}`);
            } else if (callback) {
                callback({ success: false, error: 'Invalid room name' });
            }
        };
    }

    handleLeaveRoom(socket) {
        return (roomName, callback) => {
            if (isValidRoomName(roomName)) {
                socket.leave(roomName);
                if (callback && typeof callback === 'function') {
                    callback({ success: true, room: roomName });
                }
            } else if (callback) {
                callback({ success: false, error: 'Invalid room name' });
            }
        };
    }

    handleDisconnect(io) {
        return () => {
            const user = userStore.getUser(this.socketId);
            
            if (user) {
                console.log(`🔴 User disconnected: ${user.username} (${this.socketId})`);
                
                // Broadcast to others that user left
                const leavePayload = chatService.createUserLeftPayload(user.username, user.userId);
                this.socket.broadcast.emit(CONSTANTS.EVENTS.USER_LEFT, leavePayload);
                
                // Remove from users map
                userStore.removeUser(this.socketId);
            } else {
                console.log(`🔴 Client disconnected: ${this.socketId}`);
            }
            
            console.log(`Remaining clients: ${io.engine.clientsCount}`);
            console.log(`Remaining users in map: ${userStore.getUserCount()}`);
        };
    }
}

export default new ChatController();