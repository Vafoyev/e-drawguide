const LibraryService = require('../../../services/LibraryService');
const LibraryResource = require('../../resources/LibraryResource');
const catchAsync = require('../../../utils/catchAsync');

class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }

    index = catchAsync(async (req, res) => {
        const result = await this.libraryService.getAll(req.query);

        const formattedData = LibraryResource.collection(result);

        res.status(200).json({
            success: true,
            data: formattedData.items,
            meta: result.meta
        });
    });
}

module.exports = new LibraryController(LibraryService);