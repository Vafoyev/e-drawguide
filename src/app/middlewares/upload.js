const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';
        if (file.fieldname === 'book_file') folder += 'books/';
        else if (file.fieldname === 'cover_file') folder += 'covers/';
        else if (file.fieldname === 'video_file') folder += 'videos/';
        else if (file.fieldname === 'thumbnail_file') folder += 'thumbnails/';

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = {
        'book_file': ['application/pdf'],
        'cover_file': ['image/jpeg', 'image/png', 'image/jpg'],
        'thumbnail_file': ['image/jpeg', 'image/png', 'image/jpg'],
        'video_file': ['video/mp4', 'video/x-matroska', 'video/quicktime']
    };

    if (allowedMimeTypes[file.fieldname] && allowedMimeTypes[file.fieldname].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Noto'g'ri fayl formati: ${file.fieldname}`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
});

module.exports = upload;