'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('Admin@12345', 12);

        const [existingUsers] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE login = 'super_admin' LIMIT 1;`
        );

        if (existingUsers.length === 0) {
            return queryInterface.bulkInsert('users', [{
                id: crypto.randomUUID(),
                full_name: 'Super Admin',
                login: 'super_admin',
                phone: '998900000000',
                password: hashedPassword,
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            }], {});
        }
        return Promise.resolve();
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', { login: 'super_admin' }, {});
    }
};