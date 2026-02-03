const { CacheManager } = require('../../utils/cache');
const AppError = require('../../utils/AppError');

module.exports = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    const blacklisted = await CacheManager.isBlacklisted(token);
    if (blacklisted) {
        return next(new AppError("Token yaroqsiz (tizimdan chiqilgan)!", 401));
    }

    next();
};