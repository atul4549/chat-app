import logger from "../config/logger.js";
import mongodb from "../config/mongodb.js";
import {server} from '../socket/index.js'
/**
 * Graceful shutdown handler
 * Closes HTTP server and all database connections
 */
export const setupGracefulShutdown = (server) => {
    const gracefulShutdown = async (signal) => {
        logger.info(`${signal} received, shutting down gracefully...`);
        
        // Set a timeout for forced shutdown
        const forceShutdownTimeout = setTimeout(() => {
            logger.error("Forced shutdown due to timeout");
            process.exit(1);
        }, 10000);

        try {
            // Close HTTP server
            await new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            logger.info("HTTP server closed");

            // Close database connections
            await mongodb.disconnect();
            // await postgres.close();
            // await rabbitmq.close();
            
            logger.info('All connections closed, exiting process');
            clearTimeout(forceShutdownTimeout);
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            clearTimeout(forceShutdownTimeout);
            process.exit(1);
        }
    };

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

