const { getFullUrl } = require('../../utils/urlHelper');

class VideoResource {
    static format(video) {
        if (!video) return null;
        return {
            id: video.id,
            title: video.title || "",
            description: video.description || "",
            thumbnail_url: getFullUrl(video.thumbnail_url),
            video_url: getFullUrl(video.video_url),
            created_at: video.created_at
        };
    }

    static collection(data) {
        if (!data || !data.items) return { items: [], meta: {} };
        return {
            items: data.items.map(video => this.format(video)),
            meta: data.meta
        };
    }
}

module.exports = VideoResource;