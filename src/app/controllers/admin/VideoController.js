const VideoService = require('../../../services/VideoService');
const VideoResource = require('../../resources/VideoResource');
const catchAsync = require('../../../utils/catchAsync');

class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }

    create = catchAsync(async (req, res) => {
        const video = await this.videoService.create(req.body, req.file);
        res.status(201).json({
            success: true,
            data: VideoResource.format(video)
        });
    });

    delete = catchAsync(async (req, res) => {
        await this.videoService.delete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Video muvaffaqiyatli o'chirildi"
        });
    });

    restore = catchAsync(async (req, res) => {
        const video = await this.videoService.restore(req.params.id);
        res.status(200).json({
            success: true,
            message: "Video qayta tiklandi",
            data: VideoResource.format(video)
        });
    });
}

module.exports = new VideoController(VideoService);