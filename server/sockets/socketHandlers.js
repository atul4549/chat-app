import chatController from '../controllers/chatController.js';
import { CONSTANTS } from '../utils/constants.js';

const setupSocketHandlers = (io) => {
    io.on(CONSTANTS.EVENTS.CONNECTION, (socket) => {
        console.log(`🟢 New client connected: ${socket.id}`);
        console.log(`Total clients: ${io.engine.clientsCount}`);
        
        // Attach socket id to controller for disconnect handler
        const disconnectHandler = chatController.handleDisconnect(io);
        disconnectHandler.socketId = socket.id;
        disconnectHandler.socket = socket;
        
        // Register event handlers
        socket.on(CONSTANTS.EVENTS.USER_JOIN, chatController.handleUserJoin(socket, io));
        socket.on(CONSTANTS.EVENTS.SEND_MESSAGE, chatController.handleSendMessage(socket, io));
        socket.on(CONSTANTS.EVENTS.TYPING_START, chatController.handleTypingStart(socket));
        socket.on(CONSTANTS.EVENTS.TYPING_STOP, chatController.handleTypingStop(socket));
        socket.on(CONSTANTS.EVENTS.PRIVATE_MESSAGE, chatController.handlePrivateMessage(socket));
        socket.on(CONSTANTS.EVENTS.JOIN_ROOM, chatController.handleJoinRoom(socket));
        socket.on(CONSTANTS.EVENTS.LEAVE_ROOM, chatController.handleLeaveRoom(socket));
        socket.on(CONSTANTS.EVENTS.DISCONNECT, disconnectHandler);
    });
};

export default setupSocketHandlers;