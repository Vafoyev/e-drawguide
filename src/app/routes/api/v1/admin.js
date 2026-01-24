const express = require('express');
const router = express.Router();
const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');
const UserResource = require('../../../resources/UserResource');
const UserService = require('../../../../services/UserService');

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Barcha foydalanuvchilar ro'yxati
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        // Oldingi: const users = await User.findAll();
        const users = await UserService.getAllUsers();
        const formattedUsers = users.map(user => UserResource.format(user));
        res.json({ success: true, data: formattedUsers });
    } catch (err) {
        next(err);
    }
});

module.exports = router;