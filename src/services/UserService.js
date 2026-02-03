const { User, Result, Quiz } = require('../database');
const ApiFeatures = require('../utils/apiFeatures');

class UserService {
    async getAllUsers(page = 1, limit = 10) {
        const { limit: l, offset } = ApiFeatures.getPagination(page, limit);
        const data = await User.findAndCountAll({
            where: { role: 'student' },
            attributes: ['id', 'full_name', 'phone', 'created_at'],
            limit: l,
            offset,
            order: [['created_at', 'DESC']]
        });
        return ApiFeatures.formatResponse(data, page, l);
    }

    async getAllResults(page = 1, limit = 20) {
        const { limit: l, offset } = ApiFeatures.getPagination(page, limit);
        const data = await Result.findAndCountAll({
            include: [
                { model: User, as: 'user', attributes: ['full_name', 'phone'] },
                { model: Quiz, as: 'quiz', attributes: ['title'] }
            ],
            limit: l,
            offset,
            order: [['created_at', 'DESC']]
        });
        return ApiFeatures.formatResponse(data, page, l);
    }

    async getUserHistory(userId, page = 1, limit = 10) {
        const { limit: l, offset } = ApiFeatures.getPagination(page, limit);
        const data = await Result.findAndCountAll({
            where: { user_id: userId },
            include: [{ model: Quiz, as: 'quiz', attributes: ['title'] }],
            limit: l,
            offset,
            order: [['created_at', 'DESC']]
        });
        return ApiFeatures.formatResponse(data, page, l);
    }
}

module.exports = new UserService();