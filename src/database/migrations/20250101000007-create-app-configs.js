'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('app_configs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      platform: {
        type: Sequelize.ENUM('android', 'ios'),
        allowNull: false
      },
      latest_version: {
        type: Sequelize.STRING,
        allowNull: false
      },
      minimum_version: {
        type: Sequelize.STRING,
        allowNull: false
      },
      update_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_force_update: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      message_uz: {
        type: Sequelize.STRING
      },
      message_ru: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addIndex('app_configs', ['platform']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('app_configs');
  }
};