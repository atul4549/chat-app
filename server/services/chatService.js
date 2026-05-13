import userStore from '../models/userStore.js';
import { generateMessageId, getTimestamp, sanitizeMessage } from '../utils/helpers.js';
import { CONSTANTS } from '../utils/constants.js';

class ChatService {
    createMessagePayload(message, username, userId, room = CONSTANTS.ROOMS.GENERAL) {
        return {
            id: generateMessageId(),
            text: sanitizeMessage(message),
            username,
            userId: userId || 'anonymous',
            room: room || CONSTANTS.ROOMS.GENERAL,
            timestamp: getTimestamp()
        };
    }

    createUserJoinedPayload(username, userId) {
        return {
            username,
            userId,
            message: `${username} joined the chat`,
            timestamp: getTimestamp()
        };
    }

    createUserLeftPayload(username, userId) {
        return {
            username,
            userId,
            message: `${username} left the chat`,
            timestamp: getTimestamp()
        };
    }

    createTypingPayload(username, userId, isTyping) {
        return {
            username,
            userId,
            isTyping,
            timestamp: getTimestamp()
        };
    }

    createPrivateMessagePayload(fromUsername, fromUserId, message) {
        return {
            from: fromUsername,
            fromUserId: fromUserId,
            message: sanitizeMessage(message),
            timestamp: getTimestamp()
        };
    }

    getOnlineUsers() {
        return userStore.getAllUsers();
    }

    getUserBySocketId(socketId) {
        return userStore.getUser(socketId);
    }

    findTargetSocketId(userId) {
        return userStore.findSocketIdByUserId(userId);
    }

    isUserOnline(userId) {
        return userStore.isUserOnline(userId);
    }
}

export default new ChatService();