const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ROLES = {
    ADMIN: 'admin',
    STUDENT: 'student'
};

const LANGUAGES = ['uz', 'ru', 'en'];

module.exports = {
    passwordRegex,
    ROLES,
    LANGUAGES
};