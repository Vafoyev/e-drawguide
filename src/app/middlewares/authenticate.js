const jwt = require('jsonwebtoken');
const { User } = require('../../database');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer')) {
            return res.status(401).json({ success: false, message: "Token topilmadi, iltimos login qiling!" });
        }

        token = token.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Foydalanuvchi topilmadi!" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Yaroqsiz token!" });
    }
};