const Redis = require('ioredis');
const logger = require('./logger');

const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy(times) {
        if (process.env.NODE_ENV === 'development' && times > 3) {
            logger.warn('Redisga ulanib bo‘lmadi. Keshsiz davom etilmoqda...');
            return null;
        }
        return Math.min(times * 100, 3000);
    },
    maxRetriesPerRequest: 1
};

const redis = new Redis(redisOptions);

redis.on('error', (err) => {
    if (err.code !== 'ECONNREFUSED') {
        logger.error('Redis Error:', err);
    }
});

class CacheManager {
    static async get(key) {
        try {
            if (redis.status !== 'ready') return null;
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            return null;
        }
    }

    static async set(key, value, ttl = 3600) {
        try {
            if (redis.status !== 'ready') return;
            await redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (err) {
            logger.error('Redis Set Error:', err);
        }
    }

    static async invalidate(pattern) {
        try {
            if (redis.status !== 'ready') return;
            let cursor = '0';
            do {
                const [newCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
                cursor = newCursor;
                if (keys.length > 0) {
                    await redis.del(keys);
                }
            } while (cursor !== '0');
        } catch (err) {
            logger.error('Redis Invalidate Error:', err);
        }
    }

    static async setBlacklist(token, ttl) {
        try {
            if (redis.status !== 'ready') return;
            await redis.set(`blacklist:${token}`, '1', 'EX', ttl);
        } catch (err) {
            logger.error('Blacklist Error:', err);
        }
    }

    static async isBlacklisted(token) {
        try {
            if (redis.status !== 'ready') return false;
            const res = await redis.get(`blacklist:${token}`);
            return res === '1';
        } catch (err) {
            return false;
        }
    }
}

module.exports = { CacheManager, redis };