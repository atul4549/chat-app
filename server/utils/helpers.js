export const generateMessageId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getTimestamp = () => {
    return new Date().toISOString();
};

export const sanitizeMessage = (message) => {
    // Remove any potential XSS attacks
    return message
        .replace(/[<>]/g, '')
        .trim()
        .substring(0, 500);
};

export const isValidRoomName = (roomName) => {
    return roomName && typeof roomName === 'string' && roomName.trim().length > 0;
};