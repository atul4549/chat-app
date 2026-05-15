import logger from "../config/logger.js";

/**
 * Setup process error handlers
 */
export const setupProcessHandlers = () => {
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', error);
        logger.error('Stack trace:', error.stack);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise);
        logger.error('Reason:', reason);
        process.exit(1);
    });
};