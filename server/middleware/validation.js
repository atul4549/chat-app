export const validateUserJoin = (req, res, next) => {
    const { username, userId } = req.body;
    
    if (!username || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Username and userId are required'
        });
    }
    
    if (username.length < 2 || username.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'Username must be between 2 and 50 characters'
        });
    }
    
    next();
};

export const validateMessage = (req, res, next) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Message cannot be empty'
        });
    }
    
    if (message.length > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Message cannot exceed 1000 characters'
        });
    }
    
    next();
};