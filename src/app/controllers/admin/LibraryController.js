const LibraryService = require('../../../services/LibraryService');
const catchAsync = require('../../../utils/catchAsync');
const AppError = require('../../../utils/AppError');

class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }

    create = catchAsync(async (req, res) => {
        if (!req.files || !req.files['book_file']) {
            throw new AppError('Kitob fayli (PDF) yuklanishi shart!', 400);
        }
        const library = await this.libraryService.create(req.body, req.files);
        res.status(201).json({
            success: true,
            data: library
        });
    });

    delete = catchAsync(async (req, res) => {
        await this.libraryService.delete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Kitob muvaffaqiyatli o'chirildi"
        });
    });
}

module.exports = new LibraryController(LibraryService);