const { getFullUrl } = require('../../utils/urlHelper');

class LibraryResource {
    static format(book) {
        if (!book) return null;
        return {
            id: book.id,
            title: book.title || "",
            author: book.author || "",
            language: book.language || "uz",
            file_url: getFullUrl(book.file_url),
            cover_url: getFullUrl(book.cover_url),
            created_at: book.created_at
        };
    }

    static collection(data) {
        const items = Array.isArray(data) ? data : (data.items || []);

        return {
            items: items.map(book => this.format(book)),
            meta: data.meta || {}
        };
    }
}

module.exports = LibraryResource;