module.exports = (req, res, next) => {
    const acceptLang = req.headers['accept-language'];
    req.lang = (acceptLang === 'ru' || acceptLang === 'uz') ? acceptLang : 'uz';
    next();
};