const { ROLES } = require('../../utils/constants');
const { t } = require('../../utils/i18n');

module.exports = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: t('auth.forbidden', req.lang)
            });
        }
        next();
    };
};