# 📦 VERCEL DEPLOYMENT GUIDE - Frontend + Backend (Semua di Vercel)

## 🎯 Struktur Aplikasi

```
Vercel (1 Domain)
├── Frontend (React) → login-dashboard/build/
├── Backend API (Serverless) → api/
└── Database (Supabase External)
```

**URL Production:**
```
Frontend: https://your-app.vercel.app
API: https://your-app.vercel.app/api/
Database: Supabase Cloud
```

---

## 📋 STEP 1: Persiapan Lokal

### 1.1 Test Backend Lokal
```bash
cd backend
npm start
```
Verifikasi bisa login dengan `admin`/`admin123` di `http://localhost:5000/auth/login`

### 1.2 Test Frontend Lokal
```bash
cd login-dashboard
npm start
```
Buka `http://localhost:3000` dan test login

### 1.3 Commit Semua
```bash
git add .
git commit -m "Ready for Vercel deployment - FE+BE in one domain"
git push origin main
```

---

## 🚀 STEP 2: Deploy Frontend + Backend ke Vercel

### 2.1 Import Project ke Vercel
1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New Project" → "Import Git Repository"
4. Cari & pilih repo `web-toko`

### 2.2 Configure Build Settings
Saat import, SET INI:

| Setting | Value |
|---------|-------|
| **Framework** | Other |
| **Root Directory** | `.` (root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `login-dashboard/build` |
| **Install Command** | `npm install:all` |

### 2.3 Set Environment Variables

Di **Settings → Environment Variables**, TAMBAHKAN 4 variables:

```
SUPABASE_URL              https://rmhxqvgltrbrqefshhjol.supabase.co
SUPABASE_ANON_KEY         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaHhxdmdzdHJicnFlZnNoam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTc3NTksImV4cCI6MjA5MDQ3Mzc1OX0.6thLCuj6S-vahkGfY-RXjX9RJ3f9rQk0t_t-J_-46ls
JWT_SECRET                rahasia_jwt_super_aman_123456
NODE_ENV                  production
```

### 2.4 Deploy!
Klik **Deploy** dan tunggu ~10 menit.

Hasil: `https://your-project.vercel.app`

---

## ✅ Testing Setelah Deploy

### 3.1 Test Frontend
```
https://your-project.vercel.app
```
Halaman login harus muncul.

### 3.2 Test API Health
```
GET https://your-project.vercel.app/api
```
Harus response OK.

### 3.3 Test Login
Buka login page dan test:
- Username: `admin`
- Password: `admin123`

---

## 🆘 Troubleshooting

### ❌ Build Failed
```bash
# Test lokal dulu
npm run build
npm install:all
```

### ❌ "Cannot GET /api/auth/login"
- Verifikasi file `api/auth/login.js` ada
- Cek Vercel Logs

### ❌ "Gagal koneksi ke server"
- Frontend API URL sudah auto-fix ke sama domain
- Check browser console untuk actual URL

### ❌ Supabase Connection Error
- Verifikasi env vars di Vercel: Settings → Environment Variables
- Pastikan semua 4 variables terbaca
- Redeploy: Deployments → Redeploy

---

## 🔄 Continuous Deployment

Setiap push ke `main` auto-deploy:

```bash
git push origin main
```

---
- Production: `https://your-backend-api.com` (backend Supabase/server lain)

## Langkah 5: CORS Configuration (Penting!)

Di backend (server.js), pastikan CORS sudah support domain Vercel:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
}));
```

## Environment Variables untuk Vercel:

| Variable | Value | Contoh |
|----------|-------|--------|
| REACT_APP_API_URL | Backend API URL | https://api.yourdomain.com |

## Troubleshooting

### Error: CORS Policy
- Pastikan backend CORS configuration benar
- Tambah domain Vercel ke CORS whitelist

### Error: API not found
- Pastikan REACT_APP_API_URL sudah set dengan benar di Vercel
- Periksa backend sudah running

### Blank page / build error
- Check Vercel build logs di dashboard
- Pastikan semua dependencies sudah di package.json

## Tips

1. **Development Mode**: Pastikan backend jalan di localhost:5000
2. **Production Mode**: Ganti API URL ke backend production
3. **Environment**: Gunakan different URLs untuk dev/prod
4. **Monitoring**: Check Vercel Analytics untuk performa

## Links
- GitHub Repo: https://github.com/your-username/your-repo
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
