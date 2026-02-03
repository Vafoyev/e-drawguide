'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('audit_logs', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: true
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            resource: {
                type: Sequelize.STRING,
                allowNull: false
            },
            resource_id: {
                type: Sequelize.STRING
            },
            changes: {
                type: Sequelize.JSONB
            },
            ip_address: {
                type: Sequelize.STRING
            },
            user_agent: {
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
        await queryInterface.addIndex('audit_logs', ['user_id', 'resource']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('audit_logs');
    }
};