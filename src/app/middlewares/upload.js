const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fayllarni saqlash joyini belgilash
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';
        if (file.fieldname === 'book_file') folder += 'books/';
        else if (file.fieldname === 'cover_file') folder += 'covers/';
        else if (file.fieldname === 'video_file') folder += 'videos/';

        // Papka mavjud bo'lmasa yaratish
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Fayl nomini o'zgartirish: timestamp + original_nomi
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Fayl turlarini filtrlash
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'book_file') {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Kutubxona uchun faqat PDF yuklash mumkin!'), false);
    } else if (file.fieldname === 'cover_file') {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Muqova uchun faqat rasm yuklash mumkin!'), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Maksimal 50MB
});

module.exports = upload;