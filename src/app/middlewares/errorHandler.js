module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Serverda ichki xatolik yuz berdi";

    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};