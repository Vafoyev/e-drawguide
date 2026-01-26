const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const configRoutes = require('./config');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/config', configRoutes);

module.exports = router;