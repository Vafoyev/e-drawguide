const express = require('express');
const router = express.Router();
const AuthController = require('../../../controllers/auth/AuthController');
const authenticate = require('../../../middlewares/authenticate');
const checkBlacklist = require('../../../middlewares/checkBlacklist');
const validate = require('../../../middlewares/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../../../requests/auth/AuthRequest');

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);

router.use(authenticate, checkBlacklist);

router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.getProfile);
router.get('/my-results', AuthController.getMyResults);

module.exports = router;