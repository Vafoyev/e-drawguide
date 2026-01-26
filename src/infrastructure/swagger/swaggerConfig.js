const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-DrawGuide API Dokumentatsiyasi',
            version: '1.0.0',
            description: `
## Elektron o'quv qo'llanma (LMS) Backend tizimi
Ushbu hujjat Flutter va Web dasturchilar uchun mo'ljallangan.

**Asosiy funksiyalar:**
* JWT orqali himoyalangan autentifikatsiya.
* Video darslar va elektron kutubxona boshqaruvi.
* Avtomatik hisoblanadigan Quiz (test) tizimi.
* Admin panel uchun statistika APIlari.

**Xavfsizlik:**
Aksariyat APIlar uchun \`Authorization: Bearer <token>\` headeri talab qilinadi.
            `,
            contact: {
                name: 'Murodbekovich (Backend Dev)',
                url: 'https://github.com/murodbekovich',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
                description: '💻 Local Server (Dasturchining o\'zida)',
            },
            {
                url: 'https://api.e-drawguide.uz/api/v1',
                description: '🚀 Production Server (Real masofaviy server)',
            },
            {
                url: 'https://staging-api.e-drawguide.uz/api/v1',
                description: '🧪 Staging Server (Test qilish uchun server)',
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT tokenni kiriting (Login API-dan olingan)',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
                        full_name: { type: 'string', example: 'Ali Valiyev' },
                        phone: { type: 'string', example: '998901234567' },
                        role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Video: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string', example: 'Chizmachilik 101' },
                        description: { type: 'string', example: 'Kirish darsi' },
                        video_url: { type: 'string', example: 'https://youtube.com/...' },
                        thumbnail_url: { type: 'string', example: 'https://cdn.uz/img.jpg' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Xatolik haqida batafsil ma\'lumot' }
                    }
                }
            }
        },
    },
    apis: ['./src/app/routes/api/v1/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;