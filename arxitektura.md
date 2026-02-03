e-drawguide/
├── 📂 .github/
│   └── 📂 workflows/
│       └── node.js.yml          # CI/CD Pipeline (PostgreSQL & Redis bilan)
│
├── 🐳 Docker/
│   ├── Dockerfile               # Node.js muhiti uchun
│   └── docker-compose.yml       # App, DB va Redis konteynerlari
│
├── 📂 src/
│   ├── server.js                # Entry Point (Graceful Shutdown & DB ulanish)
│   ├── app.js                   # Express App Configuration (Middlewares & Routes)
│   │
│   ├── 📂 app/                  # HTTP LAYER
│   │   ├── 📂 controllers/      # Requestlarni qabul qilish va Servislarga uzatish
│   │   │   ├── 📂 admin/        # Faqat admin huquqi bilan ishlatiladigan amallar
│   │   │   │   ├── LibraryController.js
│   │   │   │   ├── UserController.js
│   │   │   │   └── VideoController.js
│   │   │   ├── 📂 auth/         # Login, Register, Logout, Refresh
│   │   │   │   └── AuthController.js
│   │   │   ├── 📂 student/      # Talabalar uchun Read-only yoki Submit amallari
│   │   │   │   ├── LibraryController.js
│   │   │   │   ├── VideoController.js
│   │   │   └── QuizController.js   # Shared Logic (Admin uchun boshqaruv)
│   │   │
│   │   ├── 📂 middlewares/      # Security & Logic Guards
│   │   │   ├── auditLogger.js   # Admin amallarini log qilish (setImmediate bilan)
│   │   │   ├── authenticate.js  # JWT Verify (Passport-siz sodda va tezkor)
│   │   │   ├── authorize.js     # RBAC (Role Based Access Control)
│   │   │   ├── checkBlacklist.js# Redis orqali logout bo'lganlarni tekshirish
│   │   │   ├── errorHandler.js  # Global i18n supported error handler
│   │   │   ├── fileSecurity.js  # Magic Bytes & Buffer check (Xavfsiz yuklash)
│   │   │   ├── upload.js        # Multer config (Splay folders)
│   │   │   └── validate.js      # Joi runner middleware
│   │   │
│   │   ├── 📂 requests/         # Joi Validation Schemas
│   │   │   ├── auth/            # AuthRequest.js
│   │   │   ├── library/         # LibraryRequest.js
│   │   │   ├── quiz/            # QuizRequest.js
│   │   │   └── video/           # VideoRequest.js
│   │   │
│   │   ├── 📂 resources/        # DTO Layer (Data Transfer Object)
│   │   │   ├── UserResource.js  # Response formatini standartlashtirish
│   │   │   ├── QuizResource.js  # Studentga javoblarni yashirib yuborish
│   │   │   └── ... (Video, Library, Question)
│   │   │
│   │   └── 📂 routes/           # API Endpoints
│   │       └── 📂 api/
│   │           └── 📂 v1/
│   │               ├── index.js # Central Router & Health Check
│   │               ├── admin.js # /admin/* routes
│   │               ├── auth.js  # /auth/* routes
│   │               └── ... (student, config)
│   │
│   ├── 📂 services/             # BUSINESS LOGIC LAYER
│   │   ├── AppConfigService.js  # Mobil versiya tekshiruvi (Semver)
│   │   ├── AuthService.js       # JWT pair generator & Register logic
│   │   ├── LibraryService.js    # Cache invalidation & File logic
│   │   ├── QuizService.js       # Scoring logic & Transactional submit
│   │   └── ... (User, Video)
│   │
│   ├── 📂 database/             # DATA ACCESS LAYER (Sequelize)
│   │   ├── index.js             # Model associations & Init
│   │   ├── config.js            # Environment based DB config
│   │   ├── 📂 models/           # Sequelize Models (Paranoid mode)
│   │   ├── 📂 migrations/       # Database Schema history
│   │   └── 📂 seeders/          # Initial Data (Admin account)
│   │
│   ├── 📂 utils/                # CORE UTILITIES
│   │   ├── AppError.js          # Custom Error Class
│   │   ├── cache.js             # Redis Wrapper (SCAN pattern)
│   │   ├── transactional.js     # DB Transactions helper
│   │   ├── i18n.js              # Multi-language helper
│   │   └── ... (logger, fileHelper, apiFeatures)
│   │
│   └── 📂 infrastructure/
│       └── 📂 swagger/          # OpenAPI 3.0 Documentation
│
├── 📂 tests/                   # TESTING LAYER (Jest & Supertest)
│   ├── 📂 unit/                # Logic tests
│   └── 📂 integration/          # API tests
│
├── 📂 logs/                    # Winston Daily Rotate files
└── 📂 uploads/                 # Static Storage