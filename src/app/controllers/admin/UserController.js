const catchAsync = require('../../../utils/catchAsync');
const UserService = require('../../../services/UserService');
const UserResource = require('../../resources/UserResource');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    index = catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const result = await this.userService.getAllUsers(page, limit);
        const response = UserResource.collection(result);

        res.status(200).json({
            success: true,
            ...response
        });
    });

    getResults = catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const result = await this.userService.getAllResults(page, limit);

        res.status(200).json({
            success: true,
            data: result.items,
            meta: result.meta
        });
    });
}

module.exports = new UserController(UserService);