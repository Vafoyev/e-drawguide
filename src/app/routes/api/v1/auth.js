const express = require('express');
const router = express.Router();
const { authController } = require('../../../../infrastructure/container');
const authenticate = require('../../../middlewares/authenticate');
const checkBlacklist = require('../../../middlewares/checkBlacklist');
const validate = require('../../../middlewares/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../../../requests/auth/AuthRequest');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/admin/login', validate(loginSchema), authController.adminLogin);
router.post('/refresh', validate(refreshSchema), authController.refresh);

router.use(authenticate, checkBlacklist);

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.get('/my-results', authController.getMyResults);

module.exports = router;