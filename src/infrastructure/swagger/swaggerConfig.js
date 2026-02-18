const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-DrawGuide - LMS API Dokumentatsiyasi',
            version: '1.0.0',
            description: 'Talabalar platformasi uchun barcha REST APIlar.',
            contact: {
                name: 'Backend Support',
                url: 'https://e-drawguide.uz'
            }
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Asosiy V1 API Server'
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
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        path.join(__dirname, '../../docs/*.yaml')
    ]
};

const swaggerSpecs = swaggerJsdoc(options);
module.exports = swaggerSpecs;