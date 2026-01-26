const jwt = require('jsonwebtoken');
const { User } = require('../../database');

module.exports = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Iltimos, tizimga kiring!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Foydalanuvchi endi mavjud emas!" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token muddati tugagan, qayta login qiling!" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Yaroqsiz token!" });
        }
        return res.status(401).json({ success: false, message: "Autentifikatsiya xatosi!" });
    }
};