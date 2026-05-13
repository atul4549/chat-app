import { Server as socketIo } from 'socket.io';
import { getCorsOrigins } from '../middleware/cors.js';

const initializeSocket = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: getCorsOrigins(),
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        }
    });
    
    return io;
};

export default initializeSocket;