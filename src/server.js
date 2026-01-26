require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./database/index');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await sequelize.authenticate();
        logger.info('--- BAZAGA ULANISH MUVAFFAQIYATLI ---');

        if (process.env.NODE_ENV === 'development') {
        }

        app.listen(PORT, () => {
            logger.info(`--- SERVER ${PORT}-PORTDA ISHLAYAPTI (${process.env.NODE_ENV} mode) ---`);
        });
    } catch (error) {
        logger.error('Serverni ishga tushirishda xatolik: ', error);
        process.exit(1);
    }
}

start();