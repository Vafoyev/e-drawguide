const { User } = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { CacheManager } = require('../utils/cache');

class AuthService {
    async register(data) {
        const { fullName, phone, password } = data;

        const candidate = await User.findOne({ where: { phone } });
        if (candidate) throw new AppError('Bu telefon raqami allaqachon mavjud', 409);

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            full_name: fullName,
            phone,
            password: hashedPassword,
            role: 'student'
        });

        return this.generateTokenPair(user);
    }

    async login(phone, password) {
        const user = await User.findOne({ where: { phone } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Telefon yoki parol noto\'g\'ri', 401);
        }

        return this.generateTokenPair(user);
    }

    async logout(token) {
        const decoded = jwt.decode(token);
        if (!decoded) return;

        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        const ttl = exp - now;

        if (ttl > 0) {
            await CacheManager.setBlacklist(token, ttl);
        }
    }

    async refreshToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) throw new AppError('Foydalanuvchi topilmadi', 401);

            return this.generateTokenPair(user);
        } catch (err) {
            throw new AppError('Refresh token yaroqsiz yoki muddati o\'tgan', 401);
        }
    }

    generateTokenPair(user) {
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );

        const userResponse = user.toJSON();
        delete userResponse.password;

        return {
            user: userResponse,
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
}

module.exports = new AuthService();