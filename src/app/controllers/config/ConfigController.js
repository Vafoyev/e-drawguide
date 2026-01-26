const AppConfigService = require('../../../services/AppConfigService');

class ConfigController {
    async checkVersion(req, res, next) {
        try {
            const { platform, version } = req.query; // ?platform=android&version=1.0.0

            if (!platform || !version) {
                return res.status(400).json({ success: false, message: "Platform va Version yuborilishi shart!" });
            }

            const result = await AppConfigService.checkUpdate(platform, version);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ConfigController();