require('dotenv').config();
const fs = require('fs');
const validateEnv = require('./utils/envValidator');
const logger = require('./utils/logger');
const { sequelize } = require('./database/index');
const { redis } = require('./utils/cache');
const app = require('./app');

validateEnv();

const folders = [
    'uploads/books',
    'uploads/covers',
    'uploads/videos',
    'uploads/thumbnails',
    'logs'
];

folders.forEach(f => {
    if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

const PORT = process.env.PORT || 5000;
let server;

async function start() {
    try {
        await sequelize.authenticate();
        logger.info('--- BAZAGA ULANISH MUVAFFAQIYATLI ---');

        server = app.listen(PORT, () => {
            logger.info(`--- SERVER ${PORT}-PORTDA ISHLAYAPTI (${process.env.NODE_ENV} mode) ---`);
        });
    } catch (error) {
        logger.error('Serverni ishga tushirishda xatolik: ', error);
        process.exit(1);
    }
}

const shutdown = async (signal) => {
    logger.info(`--- ${signal} QABUL QILINDI ---`);
    if (server) {
        server.close(async () => {
            try {
                await redis.quit();
                logger.info('--- REDIS ULANISHI YOPILDI ---');
                await sequelize.close();
                logger.info('--- DB ULANISHI YOPILDI ---');
                process.exit(0);
            } catch (err) {
                logger.error('Shutdown jarayonida xatolik:', err);
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Server to\'xtatilyapti...');
    logger.error(`${err.name}: ${err.message}`);
    if (server) {
        shutdown('UNHANDLED_REJECTION');
    } else {
        process.exit(1);
    }
});

start();