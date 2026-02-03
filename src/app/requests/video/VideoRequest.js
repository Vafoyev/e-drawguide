const Joi = require('joi');

const videoUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|vimeo\.com\/)([a-zA-Z0-9_-]{8,11}|[0-9]{9,})(?:\S+)?$/;

const serverFileRegex = /^https?:\/\/.*\.(mp4|mkv|mov|m3u8)$/i;

const createVideoSchema = Joi.object({
    title: Joi.string().min(3).max(200).trim().required(),
    description: Joi.string().allow('', null).trim(),
    video_url: Joi.string()
        .uri()
        .custom((value, helpers) => {
            if (!videoUrlRegex.test(value) && !serverFileRegex.test(value)) {
                return helpers.message("Noto'g'ri video URL formati. YouTube, Vimeo yoki server video linki bo'lishi shart");
            }
            return value;
        })
        .required()
});

module.exports = { createVideoSchema };