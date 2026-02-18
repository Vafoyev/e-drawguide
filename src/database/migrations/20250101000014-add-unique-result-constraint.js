'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addIndex('results', ['user_id', 'quiz_id'], {
            unique: true,
            name: 'unique_user_quiz_result'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('results', 'unique_user_quiz_result');
    }
};