const logger = require('../../utils/logger');
const StorageManager = require('../../utils/storage');
const { t } = require('../../utils/i18n');

module.exports = async (err, req, res, next) => {
    const lang = req.lang || 'uz';
    let statusCode = err.statusCode || 500;
    let message = err.message;
    let errorCode = err.errorCode || 'INTERNAL_ERROR';

    const cleanupFiles = async () => {
        const filesTodelete = [];
        if (req.file) filesTodelete.push(req.file.path);
        if (req.files) {
            Object.values(req.files).flat().forEach(f => {
                if (f.path) filesTodelete.push(f.path);
            });
        }

        if (req.tempFiles && Array.isArray(req.tempFiles)) {
            filesTodelete.push(...req.tempFiles);
        }

        for (const filePath of filesTodelete) {
            await StorageManager.deleteFile(filePath).catch(() => {});
        }
    };

    await cleanupFiles();

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        errorCode = 'DUPLICATE_ENTRY';
        message = t('validation.unique_constraint', lang);
    }

    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        message = err.errors[0].message;
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorCode = 'INVALID_TOKEN';
        message = t('auth.invalid_token', lang);
    }

    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            success: false,
            message,
            errorCode,
            stack: err.stack
        });
    }

    if (statusCode === 500) {
        logger.error(`SERVER_ERROR: ${message}`, err);
        return res.status(500).json({
            success: false,
            message: t('common.server_error', lang),
            errorCode: 'SERVER_ERROR'
        });
    }

    res.status(statusCode).json({
        success: false,
        message: err.isOperational ? message : t('common.server_error', lang),
        errorCode
    });
};