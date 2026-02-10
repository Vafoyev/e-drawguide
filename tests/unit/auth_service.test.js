const AuthService = require('../../src/services/AuthService');
const { User, RefreshToken } = require('../../src/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/utils/cache', () => ({
    CacheManager: {
        get: jest.fn(),
        set: jest.fn(),
        invalidate: jest.fn(),
        isBlacklisted: jest.fn(),
        setBlacklist: jest.fn()
    },
    redis: {
        quit: jest.fn(),
        on: jest.fn()
    }
}));

jest.mock('../../src/database', () => ({
    User: { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
    RefreshToken: { create: jest.fn(), findOne: jest.fn(), destroy: jest.fn() },
    sequelize: { transaction: jest.fn(() => ({ commit: jest.fn(), rollback: jest.fn() })) }
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

describe('AuthService Unit Tests', () => {
    test('login should throw error if user not found', async () => {
        User.findOne.mockResolvedValue(null);
        await expect(AuthService.login('998901234567', 'pass'))
            .rejects.toThrow('Telefon yoki parol noto\'g\'ri');
    });
});