e-drawguide-backend/
├── .env                        # Maxfiy o'zgaruvchilar (DB, JWT)
├── .sequelizerc                # Sequelize CLI yo'l ko'rsatkichlari
├── package.json
├── src/
│   ├── server.js               # Loyihani ishga tushirish (Entry Point)
│   ├── app.js                  # Express sozlamalari va global middlewarelar
│   │
│   ├── app/                    # HTTP QATLAMI (Faqat so'rovlarni qabul qilish)
│   │   ├── controllers/        # "Svetoforlar" - Requestni olib Servicega uzatadi
│   │   │   ├── auth/           # (AuthController.js)
│   │   │   ├── admin/          # (VideoController, QuizController, LibraryController)
│   │   │   └── student/        # (Test ishlash, Video ko'rish controllerlari)
│   │   │
│   │   ├── middleware/         # Orada tekshiruvchilar
│   │   │   ├── authenticate.js # Kim ekanligini tekshirish (JWT)
│   │   │   ├── authorize.js    # Ruxsatni tekshirish (Role: admin/student)
│   │   │   └── upload.js       # Fayl yuklash (Multer)
│   │   │
│   │   ├── requests/           # "Face Control" (Validatsiya - Joi)
│   │   │   ├── auth/           # Login/Register validatsiyasi
│   │   │   ├── video/          # Video qo'shish validatsiyasi
│   │   │   └── quiz/           # Test validatsiyasi
│   │   │
│   │   ├── resources/          # Javobni chiroyli qilib qaytarish (DTO)
│   │   │   ├── UserResource.js
│   │   │   └── QuizResource.js # (Masalan: Studentga javoblarni ko'rsatmaslik)
│   │   │
│   │   └── routes/             # Yo'nalishlar (API Endpoints)
│   │       └── v1/
│   │           ├── auth.js
│   │           ├── admin.js
│   │           └── student.js
│   │
│   ├── services/               # BIZNES LOGIKA ("Miya" qismi)
│   │   ├── AuthService.js      # Login/Register mantiqi
│   │   ├── VideoService.js     # Videolar bilan ishlash
│   │   ├── QuizService.js      # ★ Testni hisoblash formulalari shu yerda
│   │   └── LibraryService.js
│   │
│   ├── database/               # MA'LUMOTLAR BAZASI QATLAMI
│   │   ├── config.js           # ✅ DB ulanish sozlamalari (Yozdik)
│   │   ├── index.js            # ✅ Modellarni ulash (Yozdik)
│   │   ├── migrations/         # ✅ Jadvallar tarixi (6 ta fayl yozdik)
│   │   ├── models/             # ✅ Jadvallar sxemasi (6 ta fayl yozdik)
│   │   └── seeders/            # Boshlang'ich adminni yaratish
│   │
│   ├── infrastructure/         # TASHQI TIZIMLAR
│   │   ├── storage/            # Fayllarni papkaga saqlash logikasi
│   │   └── swagger/            # API Dokumentatsiya
│   │
│   └── utils/                  # YORDAMCHI FAYLLAR
│       ├── AppError.js         # Xatolarni chiroyli qaytarish
│       └── logger.js           # Log yozish