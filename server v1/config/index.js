// yaha pr basically ham global level ka config likhege!!

import dotenv from "dotenv"

dotenv.config()


const config = {
    // Server
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || "3000", 10),

    // MOngodb
    mongo: {
        uri: process.env.URI,
        dbName: process.env.MONGO_DB_NAME || 'HimanshuChatApp',
    },
    jwt: {
        secret: process.env.JWT_SECRET || "SABKA_VALINTINE_WEEK_KAISE_JA_RAHA_HAI",
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },

    // Rate Limit
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // 1000 req / 15 min per IP
    },

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expiresIn: 24 * 60 * 60 * 1000
    },
     host: process.env.HOST || 'localhost',
     https: process.env.HTTPS === 'true',
     app_name: process.env.APP_NAME || 'Chat App',

}

export default config;