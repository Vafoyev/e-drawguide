module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'E-DrawGuide API Dokumentatsiyasi',
        version: '1.0.0',
        description: 'LMS - Elektron oʻquv qoʻllanma tizimi uchun REST API hujjati.',
        contact: {
            name: 'Backend Developer',
            url: 'https://e-drawguide.uz'
        }
    },
    servers: [
        {
            url: 'http://localhost:4001/api/v1',
            description: 'Local development server'
        },
        {
            url: 'https://api.e-drawguide.uz/api/v1',
            description: 'Production server'
        }
    ]
};