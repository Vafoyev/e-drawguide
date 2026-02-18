const { Library } = require('../database');
const { Op } = require('sequelize');
const ApiFeatures = require('../utils/apiFeatures');
const { CacheManager } = require('../utils/cache');
const AppError = require('../utils/AppError');
const transactional = require('../utils/transactional');
const StorageManager = require('../utils/storage');

class LibraryService {
    create = transactional(async (data, files, transaction) => {
        const existingBook = await Library.findOne({
            where: { title: data.title, author: data.author },
            transaction
        });

        if (existingBook) throw new AppError('Ushbu kitob bazada allaqachon mavjud!', 409);

        const bookFile = files['book_file'] ? files['book_file'][0] : null;
        const coverFile = files['cover_file'] ? files['cover_file'][0] : null;

        if (!bookFile) throw new AppError('Kitob fayli yuklanishi shart', 400);

        const file_url = await StorageManager.saveFile(bookFile, 'books');
        let cover_url = null;
        if (coverFile) {
            cover_url = await StorageManager.saveImage(coverFile, 'covers', 500);
        }

        const library = await Library.create({
            title: data.title,
            author: data.author,
            language: data.language,
            file_url,
            cover_url
        }, { transaction });

        await CacheManager.invalidate('library:*');
        return library;
    });

    delete = transactional(async (id, transaction) => {
        const library = await Library.findByPk(id, { paranoid: false, transaction });
        if (!library) throw new AppError('Kitob topilmadi', 404);

        const extractLocalPath = (url) => {
            if (!url) return null;
            if (url.startsWith('http')) {
                const parts = url.split('/uploads/');
                return parts.length > 1 ? `uploads/${parts[1]}` : null;
            }
            return url.startsWith('/') ? url.substring(1) : url;
        };

        if (library.deleted_at) {
            const bookPath = extractLocalPath(library.file_url);
            const coverPath = extractLocalPath(library.cover_url);

            if (bookPath) await StorageManager.deleteFile(bookPath);
            if (coverPath) await StorageManager.deleteFile(coverPath);

            await library.destroy({ force: true, transaction });
        } else {
            await library.destroy({ transaction });
        }

        await CacheManager.invalidate('library:*');
    });

    async getAll(query) {
        const { lang, search, page = 1, limit = 10 } = query;
        const cacheKey = `library:${lang || 'all'}:${search || 'all'}:${page}:${limit}`;

        const cachedData = await CacheManager.get(cacheKey);
        if (cachedData) return cachedData;

        const { limit: l, offset } = ApiFeatures.getPagination(page, limit);
        const where = {};
        if (lang) where.language = lang;
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { author: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const data = await Library.findAndCountAll({
            where,
            limit: l,
            offset,
            order: [['created_at', 'DESC']]
        });

        const response = ApiFeatures.formatResponse(data, page, l);
        await CacheManager.set(cacheKey, response, 1800);
        return response;
    }
}

module.exports = new LibraryService();