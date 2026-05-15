export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};