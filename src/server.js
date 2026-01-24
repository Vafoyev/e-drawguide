const app = require('./app');
const {sequelize} = require('./database/index');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('--- BAZAGA ULANISH MUVAFFAQIYATLI ---');

        // Baza bilan sinxronizatsiya
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`--- SERVER ${PORT}-PORTDA ISHLAYAPTI ---`);
        });
    } catch (error) {
        console.error('Xatolik yuz berdi:', error.message);
    }
}

start();