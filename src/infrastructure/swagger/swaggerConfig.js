const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-DrawGuide API',
            version: '1.0.0',
            description: 'LMS Backend API Documentation'
        },
        servers: [
            {
                url: '/api/v1',
                description: 'V1 API'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        path.join(__dirname, '../../docs/*.yaml'),
        path.join(__dirname, '../../docs/**/*.yaml')
    ]
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;