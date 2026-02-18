const { Video } = require('../database');
const { Op } = require('sequelize');
const ApiFeatures = require('../utils/apiFeatures');
const { CacheManager } = require('../utils/cache');
const AppError = require('../utils/AppError');
const transactional = require('../utils/transactional');
const StorageManager = require('../utils/storage');

class VideoService {
    async getAll(query) {
        const { search, page = 1, limit = 10 } = query;
        const cacheKey = `videos:list:${search || 'all'}:${page}:${limit}`;

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
        let thumbnail_url = null;
        if (file) {
            thumbnail_url = await StorageManager.saveImage(file, 'thumbnails', 600);
        }

        const video = await Video.create({
            title: data.title,
            description: data.description,
            video_url: data.video_url,
            thumbnail_url
        }, { transaction });

        await CacheManager.invalidate('videos:list:*');
        return video;
    });

    delete = transactional(async (id, transaction) => {
        const video = await Video.findByPk(id, { transaction });
        if (!video) throw new AppError('Video topilmadi', 404);

        if (video.thumbnail_url) {
            const cleanPath = video.thumbnail_url.startsWith('/')
                ? video.thumbnail_url.substring(1)
                : video.thumbnail_url;
            await StorageManager.deleteFile(cleanPath);
        }

        await video.destroy({ force: true, transaction });
        await CacheManager.invalidate('videos:list:*');
    });
}

module.exports = new VideoService();