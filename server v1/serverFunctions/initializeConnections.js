import logger from "../config/logger.js";
import mongodb from "../config/mongodb.js";

/**
 * Initialize database connections and start the server
 */
// async function initializeConnections() {
export const initializeConnections = async () => {
    try {
        logger.info("Initializing database connections...");

        // Connect to MongoDB
        await mongodb.connect();
        
        // Uncomment these when ready
        // await postgres.connect();
        // await rabbitmq.connect();
        
        logger.info("All database connections established successfully");
    } catch (error) {
        logger.error("Failed to initialize connections:", error);
        throw error;
    }
}
