const { Library } = require('../../../database');
const AppError = require('../../../utils/AppError');

class LibraryController {
    async create(req, res, next) {
        try {
            const { title, author, language } = req.body;

            // Fayllar kelganini tekshirish
            if (!req.files || !req.files['book_file']) {
                return next(new AppError('Kitob fayli (PDF) yuklanishi shart!', 400));
            }

            const book_file = req.files['book_file'][0];
            const cover_file = req.files['cover_file'] ? req.files['cover_file'][0] : null;

            const library = await Library.create({
                title,
                author,
                language,
                file_url: `/uploads/books/${book_file.filename}`,
                cover_url: cover_file ? `/uploads/covers/${cover_file.filename}` : null
            });

            res.status(201).json({
                success: true,
                message: "Kitob muvaffaqiyatli qo'shildi",
                data: library
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LibraryController();