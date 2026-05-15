import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getCorsOrigins } from "../middleware/cors.js";
import { socketAuthMiddleware } from "./middleware/auth.js";
import { setupConnectionHandler } from "./handlers/connection.js";
import { SOCKET_CONFIG, SOCKET_EVENTS } from "./constants.js";
// import { getIO as getIOHelper } from "./utils/helpers.js";
import { onlineUsers } from "./utils/onlineUsers.js";

// Export utilities for external use
export { onlineUsers } from "./utils/onlineUsers.js";
export * from "./utils/onlineUsers.js";
export * from "./utils/helpers.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
  pingTimeout: SOCKET_CONFIG.PING_TIMEOUT,
  pingInterval: SOCKET_CONFIG.PING_INTERVAL,
});

// Apply authentication middleware
io.use(socketAuthMiddleware);

// Handle new connections
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  setupConnectionHandler(io, socket);
});

// Export getIO function
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

export { io, app, server };