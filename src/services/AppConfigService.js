const { AppConfig } = require('../database');
const semver = require('semver');
const AppError = require('../utils/AppError');

class AppConfigService {
    async checkUpdate(platform, currentVersion) {
        const config = await AppConfig.findOne({
            where: { platform },
            order: [['created_at', 'DESC']]
        });

        if (!config) return { status: 'up_to_date' };

        const hasNewUpdate = semver.gt(config.latest_version, currentVersion);
        const isBelowMinimum = semver.lt(currentVersion, config.minimum_version);

        if (isBelowMinimum || (hasNewUpdate && config.is_force_update)) {
            return {
                status: 'force_update',
                message: config.message_uz,
                update_url: config.update_url,
                latest_version: config.latest_version
            };
        }

        if (hasNewUpdate) {
            return {
                status: 'soft_update',
                message: config.message_uz,
                update_url: config.update_url,
                latest_version: config.latest_version
            };
        }

        return { status: 'up_to_date' };
    }
}

module.exports = new AppConfigService();