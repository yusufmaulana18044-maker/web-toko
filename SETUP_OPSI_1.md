# 🎯 SETUP OPSI 1 - Backend Local + Frontend Vercel

## IP LAPTOP ANDA: `192.168.1.11`

---

## 📱 TESTING LOKAL (LAPTOP + LAPTOP)

### Terminal 1: Start Backend
```bash
cd backend
npm start
```
Tunggu sampai muncul: ✅ `Server listening on port 5000`

### Terminal 2: Start Frontend 
```bash
cd login-dashboard
npm start
```
Tunggu sampai muncul: ✅ `Compiled successfully!`

### Browser
- Buka http://localhost:3000
- Login: `admin` / `admin123`
- Semuanya harus jalan normal ✅

---

## 📱 TESTING DARI HP (HP + LAPTOP)

### Syarat:
- HP dan Laptop dalam **network WIFI yang SAMA**
- Backend tetap running di laptop

### Di HP:
1. Buka: `http://192.168.1.11:3000`
   - Frontend akan loading
   - Akan connect ke backend di laptop ✅

2. Login: `admin` / `admin123`
3. Edit produk, tambah stock, dll
4. Semuanya berfungsi normal ✅

---

## 🌐 DEPLOY KE VERCEL (Frontend)

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Setup Opsi 1: Backend Local + Frontend Vercel"
git push origin main
```

### Step 2: Deploy ke Vercel
1. Buka https://vercel.com
2. Import repository `WEB-TOKO`
3. Build Settings: Already configured ✅
4. **ADD Environment Variable:**
   ```
   Key: REACT_APP_API_URL
   Value: http://192.168.1.11:5000
   ```
5. Deploy! ✅

### Setelah Deploy
- Vercel beri URL: `https://your-domain.vercel.app`
- Gunakan di browser: `https://your-domain.vercel.app`
- Backend masih lokal di laptop: `192.168.1.11:5000`

---

## ⚠️ PENTING!

✅ **Laptop harus tetap menyala** untuk backend berfungsi
✅ Backend harus running: `npm start` di folder backend
✅ Hanya bisa akses dari HP dalam network WIFI yang sama
✅ Jika ingin 24/7 online, gunakan Opsi 2 (Railway)

---

## 🔍 Troubleshooting

**"Gagal koneksi ke server"**
- Pastikan backend running di laptop (`npm start`)
- Check IP: ketik `ipconfig` di PowerShell
- Update `.env.production` jika IP berubah

**"Tidak bisa akses dari HP"**
- Pastikan HP dan Laptop di WiFi yang sama
- Coba ping: `ping 192.168.1.11` (dari HP terminal)
- Update IP di Vercel environment varibles

**"Frontend loading lambat"**
- Normal kalau backend di local
- Improve dengan Opsi 2 (Railway)

---

## ✨ RINGKASAN

| Environment | Frontend | Backend | Database |
|---|---|---|---|
| **Local Dev** | localhost:3000 | localhost:5000 | PC Anda |
| **HP (local network)** | 192.168.1.11:3000 | 192.168.1.11:5000 | PC Anda |
| **Vercel Deploy** | vercel domain | 192.168.1.11:5000 | PC Anda |

---

**Siap? Let's go!** 🚀
