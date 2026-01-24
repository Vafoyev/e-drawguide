const { User } = require('../database');

class UserService {
    async getAllUsers() {
        const users = await User.findAll({
            attributes: ['id', 'full_name', 'phone', 'role', 'created_at']
        });
        return users;
    }

}

module.exports = new UserService();