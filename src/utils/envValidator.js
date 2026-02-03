const { cleanEnv, str, port, url } = require('envalid');
const logger = require('./logger');

const validateEnv = () => {
    try {
        cleanEnv(process.env, {
            NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
            PORT: port({ default: 5000 }),
            DB_HOST: str(),
            DB_NAME: str(),
            DB_USER: str(),
            DB_PASS: str(),
            DB_PORT: port({ default: 5432 }),
            JWT_SECRET: str(),
            JWT_REFRESH_SECRET: str(),
            JWT_ACCESS_EXPIRES_IN: str({ default: '15m' }),
            JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
            BASE_URL: url(),
            REDIS_HOST: str({ default: '127.0.0.1' }),
            REDIS_PORT: port({ default: 6379 }),
            REDIS_PASSWORD: str({ default: '' })
        });
        logger.info('Environment variables validated successfully.');
    } catch (error) {
        logger.error(`Env validation error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = validateEnv;