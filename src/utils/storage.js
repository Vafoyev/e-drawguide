const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');
const logger = require('./logger');

class StorageManager {
    static async saveImage(file, folder, width = 800, req = null) {
        const fileName = `${crypto.randomUUID()}.webp`;
        const relativePath = `uploads/${folder}/${fileName}`;
        const fullPath = path.join(process.cwd(), relativePath);

        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });

        await sharp(file.path)
            .resize(width)
            .webp({ quality: 80 })
            .toFile(fullPath);

        if (req) {
            if (!req.tempFiles) req.tempFiles = [];
            req.tempFiles.push(fullPath);
        }

        await fs.unlink(file.path).catch(() => {});

        return `/${relativePath}`;
    }

    static async saveFile(file, folder) {
        const fileName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
        const relativePath = `uploads/${folder}/${fileName}`;
        const fullPath = path.join(process.cwd(), relativePath);

        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });

        await fs.rename(file.path, fullPath);

        return `/${relativePath}`;
    }

    static async deleteFile(filePath) {
        if (!filePath) return;
        try {
            const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const fullPath = path.isAbsolute(cleanPath) ? cleanPath : path.resolve(process.cwd(), cleanPath);

            const stats = await fs.stat(fullPath).catch(() => null);
            if (stats) {
                await fs.unlink(fullPath);
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                logger.error(`Error deleting file: ${filePath}`, err);
            }
        }
    }
}

module.exports = StorageManager;