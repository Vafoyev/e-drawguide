const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./app/routes/api/v1/index');
const errorHandler = require('./app/middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const specs = require('./infrastructure/swagger/swaggerConfig');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1', routes);
app.use(errorHandler);
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('E-DrawGuide API is working!');
});

module.exports = app;