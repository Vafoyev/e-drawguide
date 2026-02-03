const { AuditLog } = require('../../database');
const logger = require('../../utils/logger');

module.exports = (resource) => (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
    }

    res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            setImmediate(async () => {
                try {
                    const resourceId = req.params.id || req.body.id || null;

                    const logData = {
                        user_id: req.user ? req.user.id : null,
                        action: req.method,
                        resource: resource,
                        resource_id: resourceId ? String(resourceId) : null,
                        changes: req.method === 'DELETE' ? { params: req.params } : req.body,
                        ip_address: req.ip || req.connection.remoteAddress,
                        user_agent: req.headers['user-agent']
                    };

                    await AuditLog.create(logData);
                } catch (err) {
                    logger.error('AuditLog Async Error:', err);
                }
            });
        }
    });

    next();
};