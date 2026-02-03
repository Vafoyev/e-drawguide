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

        const cleanCurrent = semver.clean(currentVersion) || semver.valid(semver.coerce(currentVersion));
        const cleanLatest = semver.clean(config.latest_version) || semver.valid(semver.coerce(config.latest_version));
        const cleanMin = semver.clean(config.minimum_version) || semver.valid(semver.coerce(config.minimum_version));

        if (!cleanCurrent || !cleanLatest || !cleanMin) {
            return { status: 'up_to_date' };
        }

        const hasNewUpdate = semver.gt(cleanLatest, cleanCurrent);
        const isBelowMinimum = semver.lt(cleanCurrent, cleanMin);

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