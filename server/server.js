import express from 'express';
import http from 'http';
import cors from 'cors';
import initializeSocket from './config/socket.js';
import { corsOptions } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import setupSocketHandlers from './sockets/socketHandlers.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const createServer = () => {
    const app = express();
    const server = http.createServer(app);
    const io = initializeSocket(server);
    
    // Middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });
    
    // Serve a simple status page
    app.get('/', (req, res) => {
        res.send('Chat Server is Running 🚀');
    });
    
    // Setup Socket.IO handlers
    setupSocketHandlers(io);
    
    // Error handling middleware
    app.use(notFoundHandler);
    app.use(errorHandler);
    
    return { app, server, io };
};

export default createServer;