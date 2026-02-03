const fileType = require('file-type');
const fs = require('fs').promises;
const AppError = require('../../utils/AppError');

exports.checkFileSignature = (allowedExtensions = []) => async (req, res, next) => {
    const files = [];
    if (req.file) files.push(req.file);
    if (req.files) {
        Object.values(req.files).forEach(fileArray => {
            if (Array.isArray(fileArray)) files.push(...fileArray);
            else files.push(fileArray);
        });
    }

    if (files.length === 0) return next();

    try {
        for (const file of files) {
            const stats = await fs.stat(file.path);
            const bufferSize = Math.min(stats.size, 4100);

            if (bufferSize === 0) {
                await fs.unlink(file.path).catch(() => {});
                return next(new AppError("Bo'sh fayl yuklash taqiqlanadi", 400));
            }

            const fileHandle = await fs.open(file.path, 'r');
            const { buffer } = await fileHandle.read(Buffer.alloc(bufferSize), 0, bufferSize, 0);
            await fileHandle.close();

            const type = await fileType.fromBuffer(buffer);

            if (!type || !allowedExtensions.includes(type.ext.toLowerCase())) {
                await fs.unlink(file.path).catch(() => {});
                return next(new AppError(`Fayl mazmuni ruxsat berilmagan formatda! (${file.originalname})`, 400));
            }
        }
        next();
    } catch (err) {
        next(new AppError("Faylni tekshirishda xatolik yuz berdi", 500));
    }
};