const AppConfigService = require('../../../services/AppConfigService');
const catchAsync = require('../../../utils/catchAsync');
const AppError = require('../../../utils/AppError');

class ConfigController {
    constructor(appConfigService) {
        this.appConfigService = appConfigService;
    }

    checkVersion = catchAsync(async (req, res) => {
        const { platform, version } = req.query;

        if (!platform || !version) {
            throw new AppError("Platform va Version yuborilishi shart!", 400);
        }

        const result = await this.appConfigService.checkUpdate(platform, version);

        res.status(200).json({
            success: true,
            data: result
        });
    });
}

module.exports = new ConfigController(AppConfigService);