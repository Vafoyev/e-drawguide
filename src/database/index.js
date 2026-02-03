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
        logging: false,
        define: {
            underscored: true
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const models = {};

models.User = require('./models/User')(sequelize, Sequelize.DataTypes);
models.Video = require('./models/Video')(sequelize, Sequelize.DataTypes);
models.Library = require('./models/Library')(sequelize, Sequelize.DataTypes);
models.Quiz = require('./models/Quiz')(sequelize, Sequelize.DataTypes);
models.Question = require('./models/Question')(sequelize, Sequelize.DataTypes);
models.Result = require('./models/Result')(sequelize, Sequelize.DataTypes);
models.AppConfig = require('./models/AppConfig')(sequelize, Sequelize.DataTypes);
models.AuditLog = require('./models/AuditLog')(sequelize, Sequelize.DataTypes);

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    sequelize,
    ...models
};