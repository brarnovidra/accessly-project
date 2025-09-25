# Accessly - Fullstack Accessly App

Aplikasi ini terdiri dari:
- **Frontend**: Next.js (TypeScript + TailwindCSS)
- **Backend**: Express.js (Sequelize ORM, JWT Auth, Social Login)
- **Database**: MySQL

Semua service dikelola dengan **Docker Compose**.

---

## 🚀 Prerequisites

Pastikan sudah ter-install:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📂 Struktur Folder

```
.
├── accessly-frontend-next/      # Source code frontend
├── accessly-backend-express/    # Source code backend
├── docker-compose.yml           # File docker-compose
```

---

## ⚙️ Konfigurasi Environment

### 1. Backend (`accessly-backend-express/.env`)
```env
PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASS=admin
DB_NAME=accessly_app
JWT_SECRET=supersecret

# Social login
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx
```

### 2. Frontend (`accessly-frontend-next/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🐳 Jalankan Aplikasi

1. **Build & Start**
   ```bash
   docker-compose up --build
   ```

2. **Start tanpa rebuild**
   ```bash
   docker-compose up -d
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

---

## 🌐 Akses Aplikasi

- Frontend: [http://localhost:3001](http://localhost:3001)  
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)  
- phpMyAdmin [http://localhost:8080](http://localhost:8080)  
- Database: port `3306` (MySQL)

---

## 🗄️ Database Migrations & Seeders

Masuk ke container backend:
```bash
docker exec -it accessly-backend-express sh
```

Jalankan migrasi & seeder:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 📝 Catatan

- Default database: **MySQL**  
  Jika ingin PostgreSQL, sesuaikan bagian `db` di `docker-compose.yml` dan config Sequelize.
- Pastikan sudah mengisi **Google & Facebook OAuth Credentials** di `.env`.

---

## 🤝 Kontribusi

Pull Request & Issue sangat dipersilakan 🚀
