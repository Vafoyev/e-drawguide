class ApiFeatures {
    static getPagination(page = 1, limit = 10) {
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.max(1, parseInt(limit) || 10);
        const offset = (p - 1) * l;
        return { limit: l, offset };
    }

    static formatResponse(data, page, limit) {
        const { count: total, rows: items } = data;
        const totalPages = Math.ceil(total / limit);
        return {
            items,
            meta: {
                total,
                totalPages,
                currentPage: parseInt(page) || 1,
                perPage: parseInt(limit) || 10
            }
        };
    }
}
module.exports = ApiFeatures;