exports.getFullUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;

    const baseUrl = (process.env.BASE_URL || '').trim().replace(/\/+$/, '');
    const cleanPath = filePath.trim().replace(/^\/+/, '');

    if (!baseUrl) return `/${cleanPath}`;

    return `${baseUrl}/${cleanPath}`;
};