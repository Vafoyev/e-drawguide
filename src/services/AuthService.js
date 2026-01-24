const { User } = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

class AuthService {
    async register(data) {
        const { fullName, phone, password } = data;

        const candidate = await User.findOne({ where: { phone } });
        if (candidate) throw new AppError('Bu telefon raqami allaqachon ro\'yxatdan o\'tgan', 409);

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            full_name: fullName,
            phone,
            password: hashedPassword
        });

        return this.generateToken(user);
    }

    async login(phone, password) {
        const user = await User.findOne({ where: { phone } });
        if (!user) throw new AppError('Telefon yoki parol noto\'g\'ri', 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new AppError('Telefon yoki parol noto\'g\'ri', 401);

        return this.generateToken(user);
    }

    generateToken(user) {
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );

        const userResponse = user.toJSON();
        delete userResponse.password;

        return { user: userResponse, access_token: token };
    }
}

module.exports = new AuthService();