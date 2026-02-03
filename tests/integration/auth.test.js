const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/database');

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await User.destroy({ where: { phone: '998911234567' } });
    });

    test('Yangi foydalanuvchi ro\'yxatdan o\'tishi kerak', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                fullName: 'Test User',
                phone: '998911234567',
                password: 'Password123!'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('Noto\'g\'ri login xato qaytarishi kerak', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                phone: '998911234567',
                password: 'WrongPassword'
            });
        expect(res.statusCode).toBe(401);
    });
});