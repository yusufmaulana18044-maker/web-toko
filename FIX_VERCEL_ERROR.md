# CARA FIX ERROR: Environment Variable "REACT_APP_API_URL" references Secret

## ❌ MASALAH
Error:
```
Environment Variable "REACT_APP_API_URL" references Secret "react_app_api_url", which does not exist.
```

Ini terjadi karena environment variable di Vercel pakai format referensi Secret yang salah.

---

## ✅ SOLUSI - IKUTI STEP INI DENGAN TELITI:

### Step 1: Buka Vercel Dashboard
- Buka https://vercel.com/dashboard
- Pilih PROJECT ANDA

### Step 2: Masuk ke Settings
- Klik menu **Settings** (di bagian atas project)
- Di sidebar, pilih **Environment Variables**

### Step 3: HAPUS Environment Variable yang Ada
- Cari `REACT_APP_API_URL`
- **KLIK KOTAK TRASH/DELETE di sebelah kanan**
- Pilih **Delete** saat diminta konfirmasi
- **JANGAN SKIP STEP INI!**

### Step 4: Tambah Environment Variable BARU
- Klik **"Add New"** atau **"New Environment Variable"**
- **Name**: `REACT_APP_API_URL` (HARUS PERSIS BEGINI)
- **Value**: Pilih salah satu:
  
  **Untuk Testing Lokal:**
  ```
  http://localhost:5000
  ```
  
  **Atau Backend URL Production (contoh):**
  ```
  https://your-backend-app.railway.app
  ```
  
  **INGAT: JANGAN PAKAI:**
  ❌ `@react_app_api_url`
  ❌ `${{ secrets.REACT_APP_API_URL }}`
  ❌ `${REACT_APP_API_URL}`

- **Environment**: Pilih **"Production, Preview, Development"** (semua), ATAU pilih salah satu saja

### Step 5: SAVE
- Klik **"Save"** atau **"Add"** button
- Tunggu sampai selesai

### Step 6: Redeploy
- Kembali ke project main page
- Klik **"Deployments"** 
- Cari deployment terakhir
- Klik **3 dots (...)** → **Redeploy**
- Tunggu sampai selesai

---

## 🔍 VERIFIKASI

Setelah redeploy, check:

1. **Build Success?** 
   - Vercel Dashboard → Deployments → Klik link → Buka
   - Seharusnya tidak ada error lagi

2. **Frontend Bisa Akses?**
   - Seharusnya bisa buka login page
   
3. **API Bisa Connect?**
   - Coba login
   - Buka Browser Developer Console (F12 → Console)
   - Lihat apakah ada fetch error

---

## 🆘 MASIH ERROR?

**Jika masih error deployment:**

### Option A: Bersihkan Deployment Lama
1. Settings → Deployments
2. Hapus semua old deployments
3. Trigger redeploy fresh

### Option B: Clear Cache
1. Settings → Environment Variables
2. Hapus `REACT_APP_API_URL`
3. Simpan (save)
4. Tambah lagi dengan value yang benar
5. Redeploy

### Option C: Manual Trigger
```bash
# Di terminal lokal, di root project
git add .
git commit -m "Fix Vercel env"
git push origin main
# Vercel akan auto-deploy
```

---

## 📌 NOTES

- Environment variable hanya support **plain text values**, BUKAN referensi Secret
- Jika mau pakai secrets, harus setup Vercel CLI (lebih kompleks)
- Untuk kali ini, gunakan **plain text URL** saja
- Backend URL harus **HTTPS** untuk production (tidak bisa HTTP)

---

## 🎯 BACKEND URL OPTIONS

Pilih salah satu:

| Option | URL Contoh | Status |
|--------|-----------|--------|
| Lokal (dev only) | `http://localhost:5000` | Hanya di lokal |
| Railway | `https://app-name.railway.app` | Recommended |
| Render | `https://app-name.onrender.com` | Bisa juga |
| Heroku | `https://app-name.herokuapp.com` | Bayar sekarang |

**Sesuaikan dengan di mana backend Anda deploy!**

---

Sudah mencoba step-step di atas? Update saya hasilnya!
