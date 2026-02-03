const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const { User } = require('../../database/index');

module.exports = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError("Iltimos, tizimga kiring!", 401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            return next(new AppError("Ushbu tokenga tegishli foydalanuvchi endi mavjud emas!", 401));
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError("Token yaroqsiz yoki muddati o'tgan!", 401));
    }
};