const { sequelize } = require('../database');
const { redis } = require('./cache');
const os = require('os');

exports.checkSystemHealth = async () => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        system: {
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage(),
            freeMem: os.freemem(),
            totalMem: os.totalmem()
        },
        services: {
            database: 'unknown',
            redis: 'unknown'
        }
    };

    try {
        await sequelize.authenticate();
        health.services.database = 'connected';
    } catch (err) {
        health.services.database = 'disconnected';
        health.status = 'unhealthy';
    }

    try {
        if (redis && redis.status === 'ready') {
            const start = Date.now();
            await redis.ping();
            health.services.redis = `connected (${Date.now() - start}ms)`;
        } else {
            health.services.redis = 'disconnected/reconnecting';
            if (process.env.NODE_ENV === 'production') health.status = 'degraded';
        }
    } catch (err) {
        health.services.redis = 'error';
        health.status = 'unhealthy';
    }

    return health;
};