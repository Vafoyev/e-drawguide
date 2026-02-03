const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

exports.removeFiles = async (files) => {
    if (!files) return;

    const deleteFile = async (filePath) => {
        if (!filePath) return;

        try {
            const fullPath = path.isAbsolute(filePath)
                ? filePath
                : path.join(process.cwd(), filePath);

            const stats = await fs.stat(fullPath).catch(() => null);
            if (stats && stats.isFile()) {
                await fs.unlink(fullPath);
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                logger.error(`File removal error: ${filePath}`, err);
            }
        }
    };

    if (typeof files === 'string') {
        await deleteFile(files);
    } else if (files.path) {
        await deleteFile(files.path);
    } else if (Array.isArray(files)) {
        await Promise.allSettled(files.map(file => deleteFile(file.path || file)));
    } else if (typeof files === 'object') {
        const paths = [];
        Object.values(files).forEach(val => {
            const items = Array.isArray(val) ? val : [val];
            items.forEach(item => {
                if (item && item.path) paths.push(item.path);
                else if (typeof item === 'string') paths.push(item);
            });
        });
        await Promise.allSettled(paths.map(p => deleteFile(p)));
    }
};