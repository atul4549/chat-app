import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http"; // Need to import createServer

import  connectDB  from "./mongodb.js";
import { initializeSocket } from "./socket.js"; // Import initializeSocket separately

import app from './app.js'

dotenv.config();
import config from './config/index.js'
const PORT = config.port;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io with the HTTP server
initializeSocket(httpServer);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

import cookieParser from "cookie-parser";
import morgan from "morgan"; // for logging

// Add after cors middleware
app.use(cookieParser());
// ============================================================================
// TODO: install morgon
app.use(morgan("dev")); // helpful for debugging
// ============================================================================

import rateLimit from "express-rate-limit";
import logger from "./config/logger.js";
// import config from "./config/index.js";
// ============================================================================
import helmet from "helmet";

// Security middleware
app.use(helmet());
// ============================================================================

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Connect to database and start server
// await connectDB.connect()
  // .then(() => {
  //   httpServer.listen(PORT, () => {
  //     console.log(`🚀 Server running on http://localhost:${PORT}`);
  //     console.log(`📱 Health check: http://localhost:${PORT}/health`);
  //   });
  // })
  // .catch((error) => {
  //   console.error("❌ Failed to start server:", error);
  //   process.exit(1);
  // });

/**
 * Initialize database connections and start the server
 */
async function initializeConnection() {
    try {
        logger.info("Initializing database connections...");

        // Connect to MongoDB;
        await mongodb.connect();

        logger.info("All connections established successfully");
    } catch (error) {
        logger.error("Failed to initialize connections:", error);
        throw error;
    }
}

/**
 * Start the Express server after establishing database connections.
 * Also sets up graceful shutdown handlers for SIGINT and SIGTERM signals.
 * On shutdown, it closes the HTTP server and all database connections before exiting the process.
 * If any error occurs during startup or shutdown, it logs the error and exits with a non-zero status code.
 */

async function startServer() {
  try {
    await initializeConnection();

     const server = app.listen(config.port, () => {
            logger.info(`Server started on port ${config.port}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${config.port}`);
            console.log(`
                🚀 Server is running!
                ✅ Environment: ${config.NODE_ENV}
                ✅ Port: ${config.PORT}
                ✅ Health check: http://localhost:${config.PORT}/api/health
                ✅ Root endpoint: http://localhost:${config.PORT}/
                ✅ Time: ${new Date().toISOString()}
            `);
        });
    
        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info("HTTP server closed");

                try {
                    await mongodb.disconnect();
                    // await postgres.close();
                    // await rabbitmq.close();
                    logger.info('All connections closed, exiting process');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            })

            setTimeout(() => {
                logger.error("Forced shutdown")
                process.exit(1);
            }, 10000);

        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('unhandledRejection');
        });

  } catch(error){
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer()
export { httpServer }; // Export for use in other files if needed