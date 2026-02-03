'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addIndex('libraries', ['title', 'author'], {
            unique: true,
            name: 'unique_book_constraint'
        });

        await queryInterface.addIndex('videos', ['video_url'], {
            unique: true,
            name: 'unique_video_url_constraint'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('libraries', 'unique_book_constraint');
        await queryInterface.removeIndex('videos', 'unique_video_url_constraint');
    }
};