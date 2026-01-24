const { Sequelize } = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: false
    }
);

const models = {};

models.User = require('./models/User')(sequelize, Sequelize.DataTypes);
models.Video = require('./models/Video')(sequelize, Sequelize.DataTypes);
models.Library = require('./models/Library')(sequelize, Sequelize.DataTypes);
models.Quiz = require('./models/Quiz')(sequelize, Sequelize.DataTypes);
models.Question = require('./models/Question')(sequelize, Sequelize.DataTypes);
models.Result = require('./models/Result')(sequelize, Sequelize.DataTypes);

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    sequelize,
    ...models
};