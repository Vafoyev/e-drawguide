const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ROLES = {
    ADMIN: 'admin',
    STUDENT: 'student'
};

const LANGUAGES = {
    UZ: 'uz',
    RU: 'ru',
    EN: 'en'
};

const DEFAULT_LANG = 'uz';

module.exports = {
    PASSWORD_REGEX,
    ROLES,
    LANGUAGES,
    DEFAULT_LANG
};