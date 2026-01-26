const express = require('express');
const router = express.Router();
const ConfigController = require('../../../controllers/config/ConfigController');

/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Ilova sozlamalari va versiya nazorati
 */

/**
 * @swagger
 * /config/check-version:
 *   get:
 *     summary: Ilova versiyasini tekshirish
 *     tags: [Config]
 *     parameters:
 *       - in: query
 *         name: platform
 *         required: true
 *         schema: { type: string, enum: [android, ios] }
 *       - in: query
 *         name: version
 *         required: true
 *         schema: { type: string, example: "1.0.0" }
 *     responses:
 *       200:
 *         description: Versiya holati
 */
router.get('/check-version', ConfigController.checkVersion);

module.exports = router;