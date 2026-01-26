const express = require('express');
const router = express.Router();
const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');
const UserService = require('../../../../services/UserService');
const UserResource = require('../../../resources/UserResource');
const LibraryController = require('../../../controllers/admin/LibraryController');
const upload = require('../../../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Faqat Adminlar uchun boshqaruv APIlari
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Barcha foydalanuvchilar ro'yxatini olish
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 *       403:
 *         description: Ruxsat berilmagan (Faqat Admin)
 */
router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        const formattedUsers = users.map(user => UserResource.format(user));
        res.json({ success: true, data: formattedUsers });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /admin/library:
 *   post:
 *     summary: Yangi kitob yuklash (PDF va Rasm bilan)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, author, language, book_file]
 *             properties:
 *               title: { type: string, example: "Chizmachilik" }
 *               author: { type: string, example: "Toshmatov" }
 *               language: { type: string, example: "uz" }
 *               book_file: { type: string, format: binary, description: "PDF fayl" }
 *               cover_file: { type: string, format: binary, description: "Kitob muqovasi (rasm)" }
 *     responses:
 *       201:
 *         description: Kitob saqlandi
 */
router.post('/library',
    authenticate,
    authorize('admin'),
    upload.fields([
        { name: 'book_file', maxCount: 1 },
        { name: 'cover_file', maxCount: 1 }
    ]),
    LibraryController.create
);

module.exports = router;