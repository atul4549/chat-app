// import { app, server as ch } from "./socket.js";
import mongodb from "./config/mongodb.js";
import logger from './config/logger.js';
import config from './config/index.js';
import { app, server as ch, getIO, getOnlineUsers, sendToUser } from './socket/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { initializeConnections } from "./serverFunctions/initializeConnections.js";
import { setupProcessHandlers } from "./serverFunctions/setupProcessHandlers.js";
import { printStartupInfo } from "./serverFunctions/printStartupInfo.js";
import { setupGracefulShutdown } from "./serverFunctions/setupGracefulShutdown.js";
import ResponseFormatter from "./utils/responseFormatter.js";

// Your Express routes here
app.get('/api/users/online', (req, res) => {
  res.json({ onlineUsers: getOnlineUsers() });
});

// Send notification to specific user
app.post('/api/notify/:userId', async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;
  
  const sent = sendToUser(getIO(), userId, 'notification', { message });
  res.json({ sent });
});


/**
 * Request logging middleware
 * Logs the HTTP method, path, IP address, and user agent for each incoming request.
 */
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            'Service is healthy'
        )
    );
});

/**
 * Root endpoint
 * Provides basic information about the API service and available endpoints.
 */
app.get("/", (req, res) => {
    return res.status(200).json(
        ResponseFormatter.success(
            {
                service: 'Himanshu Encrypted Chat App',
                version: '1.0.0',
                endpoints: {
                    health: '/health',
                    auth: '/api/auth',
                    // ingest: '/api/hit',
                    // analytics: '/api/analytics',
                },
            },
            'Himanshu Encrypted Chat App'
        )
    );
});

// Uncomment these as needed
// app.use("/api/auth", authRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
    return res.status(404).json(ResponseFormatter.error("Endpoint not found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(500).json(ResponseFormatter.error("Internal server error", 500));
});


// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;


/**
 * Start the Express server after establishing database connections
 */
async function startServer() {
    try {
        // Initialize all database connections
        await initializeConnections();
        
        // Setup process error handlers
        setupProcessHandlers();
        
        // Start the HTTP/Socket server
        const server = ch.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${PORT}`);
            printStartupInfo();
        });
        
        // Setup graceful shutdown handlers
        setupGracefulShutdown(server);
        
        logger.info("Server initialization completed successfully");
        
    } catch (error) {
        logger.error('Failed to start server:', error);
        logger.error('Stack trace:', error.stack);
        
        // Attempt to close any open connections before exiting
        try {
            await mongodb.disconnect();
        } catch (dbError) {
            logger.error('Error disconnecting MongoDB:', dbError);
        }
        
        process.exit(1);
    }
}

// Start the application
startServer();