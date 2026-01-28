class LibraryResource {
    static format(book) {
        if (!book) return null;
        const baseUrl = process.env.BASE_URL || '';

        return {
            id: book.id,
            title: book.title || "",
            author: book.author || "",
            language: book.language || "uz",
            file_url: book.file_url ? `${baseUrl}${book.file_url}` : "",
            cover_url: book.cover_url ? `${baseUrl}${book.cover_url}` : "",
            created_at: book.created_at
        };
    }

    static collection(books) {
        if (!books || !Array.isArray(books)) return [];
        return books.map(book => this.format(book));
    }
}

module.exports = LibraryResource;