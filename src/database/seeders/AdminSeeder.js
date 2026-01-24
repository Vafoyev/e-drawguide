const bcrypt = require('bcrypt');
const { User } = require('../index');

async function seedAdmin() {
    try {
        if (!User) {
            throw new Error("User modeli topilmadi! index.js yoki User.js da xato bor.");
        }

        const hashedPassword = await bcrypt.hash('admin123', 12);

        const [admin, created] = await User.findOrCreate({
            where: { phone: '998900000000' },
            defaults: {
                full_name: 'Super Admin',
                password: hashedPassword,
                role: 'admin'
            }
        });

        if (created) {
            console.log('--- YANGI ADMIN YARATILDI ---');
        } else {
            console.log('--- ADMIN ALLAQACHON MAVJUD ---');
        }
        process.exit();
    } catch (error) {
        console.error('Seederda xatolik:', error);
        process.exit(1);
    }
}

seedAdmin();