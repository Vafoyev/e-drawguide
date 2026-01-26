const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const routes = require('./app/routes/api/v1/index');
const errorHandler = require('./app/middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const specs = require('./infrastructure/swagger/swaggerConfig');

const app = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Juda ko'p so'rov yuborildi, birozdan keyin urinib ko'ring." }
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
    const AppError = require('./utils/AppError');
    next(new AppError(`Bu yo'nalish topilmadi: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;