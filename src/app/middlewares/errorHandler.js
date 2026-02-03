const logger = require('../../utils/logger');
const { removeFiles } = require('../../utils/fileHelper');
const { t } = require('../../utils/i18n');

module.exports = async (err, req, res, next) => {
    const lang = req.lang || 'uz';
    err.statusCode = err.statusCode || 500;

    if (req.file || req.files) {
        try {
            await removeFiles(req.file || req.files);
        } catch (fileError) {
            logger.error('Cleanup Error:', fileError);
        }
    }

    if (err.statusCode === 500) {
        logger.error('SERVER_ERROR:', {
            message: err.message,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userId: req.user ? req.user.id : null
        });
        err.message = t('common.server_error', lang);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        err.statusCode = 409;
        err.message = t('validation.unique_constraint', lang);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};