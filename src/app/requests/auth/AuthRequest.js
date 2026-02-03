const Joi = require('joi');
const { passwordRegex } = require('../../../utils/constants');

const registerSchema = Joi.object({
    fullName: Joi.string().min(3).max(80).trim().required().messages({
        'string.empty': "Ism familiya bo'sh bo'lishi mumkin emas",
        'string.min': "Ism familiya kamida 3 ta harf bo'lishi kerak"
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{9,12}$/).required().messages({
        'string.pattern.base': "Telefon raqami noto'g'ri formatda",
        'any.required': "Telefon raqami yuborilishi shart"
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': "Parol kamida 8 ta belgi, bitta katta harf, raqam va maxsus belgi bo'lishi shart"
    }),
    role: Joi.string().valid('student', 'admin').default('student')
});

const loginSchema = Joi.object({
    phone: Joi.string().required().messages({ 'string.empty': "Telefon raqamini kiriting" }),
    password: Joi.string().required().messages({ 'string.empty': "Parolni kiriting" })
});

const refreshSchema = Joi.object({
    refresh_token: Joi.string().required().messages({ 'string.empty': "Refresh token yuborilishi shart" })
});

module.exports = { registerSchema, loginSchema, refreshSchema };