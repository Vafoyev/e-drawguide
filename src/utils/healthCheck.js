const { sequelize } = require('../database');
const { redis } = require('./cache');

exports.checkSystemHealth = async () => {
    const health = {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        checks: {
            database: 'unknown',
            redis: 'unknown'
        }
    };

    try {
        await sequelize.authenticate();
        health.checks.database = 'connected';
    } catch (err) {
        health.checks.database = 'disconnected';
        health.status = 'unhealthy';
    }

    try {
        if (redis.status === 'ready') {
            health.checks.redis = 'connected';
        } else {
            health.checks.redis = 'disconnected';
            health.status = 'unhealthy';
        }
    } catch (err) {
        health.checks.redis = 'disconnected';
        health.status = 'unhealthy';
    }

    return health;
};