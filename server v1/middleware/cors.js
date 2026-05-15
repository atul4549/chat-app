export const getCorsOrigins = () => {
    if (process.env.NODE_ENV === "production") {
        try {
            return JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
        } catch (error) {
            console.error('Error parsing ALLOWED_ORIGINS:', error);
            return [];
        }
    }
    // return [
    //     "http://localhost:5173",
    //     "http://localhost:8081",
    //     "http://localhost:3000",
    // ];
    return true; // allow all origins in development
};

export const corsOptions = {
    origin: getCorsOrigins(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", 'Cookie'],
};