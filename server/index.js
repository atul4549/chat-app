import dotenv from 'dotenv';
import createServer from './server.js';
import { connectDB } from './db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const { server } = createServer();
        
        // Connect to database
        await connectDB();
        
        // Start server
        server.listen(PORT, () => {
            console.log(`
  ╔════════════════════════════════════════╗
  ║   💬 Chat Server Running Successfully  ║
  ╠════════════════════════════════════════╣
  ║   URL: http://localhost:${PORT}        ║
  ║   Socket.IO Server: Ready              ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
  ║   Waiting for connections...           ║
  ╚════════════════════════════════════════╝
            `);
        });
        
        // Graceful shutdown
        const gracefulShutdown = () => {
            console.log('Received shutdown signal, closing server...');
            server.close(() => {
                console.log('Server closed gracefully');
                process.exit(0);
            });
        };
        
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();