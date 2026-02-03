'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('Admin@12345', 12);

        const [existingUsers] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE phone = '998900000000' LIMIT 1;`
        );

        if (existingUsers.length === 0) {
            return queryInterface.bulkInsert('users', [{
                id: crypto.randomUUID(),
                full_name: 'Super Admin',
                phone: '998900000000',
                password: hashedPassword,
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            }], {});
        } else {
            return Promise.resolve();
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', { phone: '998900000000' }, {});
    }
};