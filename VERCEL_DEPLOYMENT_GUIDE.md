# 🚀 DEPLOYMENT KE VERCEL - PANDUAN LENGKAP

## 📋 Checklist Deploy ke Vercel

### Step 1: Setup Database untuk Vercel
❌ **PostgreSQL Local TIDAK bisa** diakses dari Vercel
✅ **Pilih salah satu:**

**Opsi A: Supabase (Recommended)**
- URL: https://supabase.com
- Buat project baru
- Copy `DATABASE_URL` 
- Format: `postgresql://user:password@host:port/dbname?sslmode=require`

**Opsi B: Railway**
- URL: https://railway.app
- Buat PostgreSQL database
- Copy database URL

**Opsi C: Neon**
- URL: https://neon.tech
- PostgreSQL serverless
- Copy connection string

### Step 2: Push Code ke GitHub
```bash
git add .
git commit -m "Setup Vercel deployment with Backend + Frontend"
git push origin main
```

### Step 3: Deploy ke Vercel
1. Buka https://vercel.com
2. Login dengan GitHub account
3. Click "New Project"
4. Select repository `WEB-TOKO`
5. Framework: **Other** (karena custom setup)
6. Build Command: **Leave as is** (sudah di vercel.json)
7. Output Directory: **Leave as is**

### Step 4: Add Environment Variables di Vercel
Di Vercel project settings → Environment Variables, tambahkan:

```
DATABASE_URL = postgresql://user:password@host:port/dbname?sslmode=require
NODE_ENV = production
REACT_APP_API_URL = https://your-vercel-domain.vercel.app
```

**PENTING:** Ganti `https://your-vercel-domain.vercel.app` dengan URL Vercel yang akan diberikan

### Step 5: Redeploy
Setelah set env vars, Vercel akan auto-redeploy. Tunggu sampai ✅ "Deployment successful"

---

## 🌐 Setelah Deploy

### Cek apakah berfungsi:
```
Frontend: https://your-domain.vercel.app
Backend:  https://your-domain.vercel.app/auth/login
API:      https://your-domain.vercel.app/products
```

### Test login:
```bash
curl -X POST https://your-domain.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🔧 Troubleshooting

### Error: "Cannot find database"
- Pastikan DATABASE_URL sudah set di Vercel env
- Check DATABASE_URL format: `postgresql://...`

### Error: "Connection refused on port 5432"
- Database host/port salah
- Vercel tidak bisa akses database
- Check firewall/security group di database provider

### Error: "EADDRINUSE (port already in use)"
- Backend code masih hardcode port 5000
- Update `backend/index.js` untuk gunakan `process.env.PORT || 5000`

### Frontend masih connect ke localhost
- Check browser console (F12)
- Pastikan apiConfig.js punya `REACT_APP_API_URL` dari env

---

## 📝 Deployment Checklist

- [ ] Database setup (Supabase/Railway/Neon)
- [ ] DATABASE_URL copied
- [ ] GitHub repo updated
- [ ] Vercel project created
- [ ] Environment variables set di Vercel
- [ ] Deploy successful (✅ status)
- [ ] Frontend loads at vercel domain
- [ ] Login test works
- [ ] API endpoints respond

---

## 🎓 Untuk Development (TETAP PAKAI LOCAL)

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd login-dashboard
npm start

# Buka http://localhost:3000
```

**API Config otomatis detect localhost dan gunakan `http://localhost:5000`**

---

## 📞 Quick Reference

| Env | Frontend | Backend | Database |
|-----|----------|---------|----------|
| **Local** | localhost:3000 | localhost:5000 | Your PC |
| **Vercel** | vercel domain | Same as frontend | Supabase/Railway |

---

**Jika ada error, jalankan TEST_API.js untuk diagnose:**
```bash
node TEST_API.js
```
