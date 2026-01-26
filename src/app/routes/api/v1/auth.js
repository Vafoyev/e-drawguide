const express = require('express');
const router = express.Router();
const AuthController = require('../../../controllers/auth/AuthController');
const authenticate = require('../../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Foydalanuvchi autentifikatsiyasi
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yangi foydalanuvchini ro'yxatdan o'tkazish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, phone, password]
 *             properties:
 *               fullName: { type: string, example: "Ali Valiyev" }
 *               phone: { type: string, example: "998901234567" }
 *               password: { type: string, example: "password123", minLength: 6 }
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tildi
 *       409:
 *         description: Telefon raqami band
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Tizimga kirish (Token olish)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone: { type: string, example: "998901234567" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Kirish muvaffaqiyatli
 *       401:
 *         description: Telefon yoki parol xato
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Shaxsiy profil ma'lumotlarini olish
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil ma'lumotlari
 *       401:
 *         description: Avtorizatsiya xatosi
 */
router.get('/profile', authenticate, AuthController.getProfile);

module.exports = router;