const VideoService = require('../../../services/VideoService');
const VideoResource = require('../../resources/VideoResource');
const catchAsync = require('../../../utils/catchAsync');

class VideoController {
    index = catchAsync(async (req, res) => {
        const result = await VideoService.getAll(req.query);

        res.status(200).json({
            success: true,
            data: VideoResource.collection(result).items,
            meta: result.meta
        });
    });
}

module.exports = new VideoController();