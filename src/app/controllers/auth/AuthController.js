const AuthService = require('../../../services/AuthService');
const UserService = require('../../../services/UserService');
const UserResource = require('../../resources/UserResource');
const catchAsync = require('../../../utils/catchAsync');

class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }

    register = catchAsync(async (req, res) => {
        const result = await this.authService.register(req.body);
        res.status(201).json({
            success: true,
            user: UserResource.format(result.user),
            ...result
        });
    });

    login = catchAsync(async (req, res) => {
        const result = await this.authService.login(req.body.phone, req.body.password);
        res.status(200).json({
            success: true,
            user: UserResource.format(result.user),
            ...result
        });
    });

    logout = catchAsync(async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        await this.authService.logout(token);
        res.status(200).json({
            success: true,
            message: "Tizimdan muvaffaqiyatli chiqildi"
        });
    });

    refresh = catchAsync(async (req, res) => {
        const result = await this.authService.refreshToken(req.body.refresh_token);
        res.status(200).json({
            success: true,
            ...result
        });
    });

    getProfile = catchAsync(async (req, res) => {
        res.status(200).json({
            success: true,
            user: UserResource.format(req.user)
        });
    });

    getMyResults = catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const result = await this.userService.getUserHistory(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.items,
            meta: result.meta
        });
    });
}

module.exports = new AuthController(AuthService, UserService);