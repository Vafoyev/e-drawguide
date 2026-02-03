# 🎓 E-DrawGuide - Enterprise Grade LMS Backend

**E-DrawGuide** — bu talabalar uchun video darslar, elektron kutubxona va real-vaqt rejimida test topshirish imkoniyatini beruvchi, yuqori yuklamalarga chidamli (scalable) Learning Management System (LMS) platformasining backend qismi.

[![Node.js Version](https://img.shields.io/badge/node-v18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/cache-Redis-red.svg)](https://redis.io/)

---

## 🏗 Arxitektura va Texnologiyalar

Loyiha **Service-Oriented Architecture (SOA)** va **Clean Architecture** tamoyillariga asoslangan:

- **Runtime:** Node.js v18 (LTS)
- **Database:** PostgreSQL 15 (Sequelize ORM bilan)
- **Caching:** Redis (Distributed caching & Blacklisting)
- **Security:** JWT Auth, Bcrypt (Password Hashing), Rate Limiting, Helmet, XSS Protection.
- **Infrastructure:** Docker & Docker Compose (Containerization).
- **Validation:** Joi (Schema validation).
- **API Documentation:** Swagger (OpenAPI 3.0).

---

## 🚀 Tezyurar Start (Docker bilan)

Loyiha barcha bog'liqliklari (Database, Redis, App) bilan bitta komanda orqali ishga tushadi:

### 1. Muhitni sozlash
```bash
cp .env.example .env
# .env faylini oching va DB_PASS, JWT_SECRET kabilarni o'zgartiring


Docker Konteynerlarni qurish va ishga tushirish
docker-compose up --build -d


🛠 Ma'lumotlar Bazasini Boshqarish (Terminal)
Vazifasi	                        Docker Komandasi	                              Local (npm) Komandasi
Full Setup (Migrate + Seed)	        docker-compose exec app npm run db:setup	      npm run db:setup
Migratsiyalarni yurgizish	        docker-compose exec app npm run db:migrate	      npm run db:migrate
Baza ma'lumotlarini to'ldirish	    docker-compose exec app npm run db:seed	          npm run db:seed
Bazani tozalash va reset qilish	    docker-compose exec app npm run db:reset	      npm run db:reset
Keshni (Redis) tozalash	            docker-compose exec redis redis-cli flushall	  redis-cli flushall


Docker tizimini butunlay tozalash
docker-compose down -v --rmi all --remove-orphans

🔗 Muhim Havolalar (Dashboard)
API Dokumentatsiya (Swagger): http://localhost:4001/api-docs/
Ma'lumotlar Bazasi UI (Adminer): http://localhost:8080/
    Server: db
    Username: postgres
System Health Check: http://localhost:4001/api/v1/health


http://localhost:4001/api-docs/

http://localhost:8080/