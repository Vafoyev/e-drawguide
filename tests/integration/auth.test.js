const request = require('supertest');
const app = require('../../src/app');
const { User, sequelize } = require('../../src/database');
const { redis } = require('../../src/utils/cache');

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: false });
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
    });

    afterAll(async () => {
        await sequelize.close();
        if (redis.status !== 'end') {
            await redis.quit();
        }
    });
});