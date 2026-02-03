const fs = require('fs');
const path = require('path');

const locales = {};
const localesPath = path.join(__dirname, '../../locales');

try {
    const files = fs.readdirSync(localesPath);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const lang = path.basename(file, '.json');
            locales[lang] = JSON.parse(fs.readFileSync(path.join(localesPath, file), 'utf8'));
        }
    });
} catch (err) {
    console.error('Lokalizatsiya fayllarini yuklashda xatolik:', err);
}

exports.t = (key, lang = 'uz') => {
    const language = locales[lang] ? lang : 'uz';
    const keys = key.split('.');
    let result = locales[language];

    for (const k of keys) {
        if (result && result[k]) {
            result = result[k];
        } else {
            result = key;
            break;
        }
    }
    return result;
};