const { Video } = require('../database');
const { Op } = require('sequelize');
const ApiFeatures = require('../utils/apiFeatures');
const { CacheManager } = require('../utils/cache');
const { removeFiles } = require('../utils/fileHelper');
const AppError = require('../utils/AppError');
const transactional = require('../utils/transactional');

class VideoService {
    async getAll(query) {
        const { search, page = 1, limit = 10 } = query;
        const cacheKey = `videos:${search || 'all'}:${page}:${limit}`;

        const cachedData = await CacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        const { limit: l, offset } = ApiFeatures.getPagination(page, limit);
        const where = search ? { title: { [Op.iLike]: `%${search}%` } } : {};

        const data = await Video.findAndCountAll({
            where,
            limit: l,
            offset,
            order: [['created_at', 'DESC']]
        });

        const response = ApiFeatures.formatResponse(data, page, l);
        await CacheManager.set(cacheKey, response, 1800);
        return response;
    }

    create = transactional(async (data, file, transaction) => {
        const existingVideo = await Video.findOne({
            where: { video_url: data.video_url },
            transaction
        });

        if (existingVideo) {
            throw new AppError('Ushbu video linki bazada allaqachon mavjud!', 409);
        }

        const video = await Video.create({
            title: data.title,
            description: data.description,
            video_url: data.video_url,
            thumbnail_url: file ? `/uploads/thumbnails/${file.filename}` : null
        }, { transaction });

        await CacheManager.invalidate('videos:*');
        return video;
    });

    delete = transactional(async (id, transaction) => {
        const video = await Video.findByPk(id, { transaction });
        if (!video) throw new AppError('Video topilmadi', 404);

        await video.destroy({ transaction });
        await CacheManager.invalidate('videos:*');
    });

    async restore(id) {
        const video = await Video.findByPk(id, { paranoid: false });
        if (!video) throw new AppError('Video topilmadi', 404);

        await video.restore();
        await CacheManager.invalidate('videos:*');
        return video;
    }
}

module.exports = new VideoService();