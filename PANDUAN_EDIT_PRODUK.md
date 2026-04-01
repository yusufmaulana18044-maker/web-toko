# 🚀 PANDUAN LENGKAP - EDIT PRODUK & STOCK

##  Status Database
✅ Database sudah terisi dengan 10 produk + stock
✅ Semuanya memakai PostgreSQL (bukan Supabase)
✅ Backend sudah ready di port 5000

## 📝 Cara Menggunakan

###  Step 1: Start Backend
```bash
cd backend
npm start
# Atau gunakan script test:
node TEST_API.js
```

###  Step 2: Start Frontend
```bash
cd login-dashboard
npm start
# Buka http://localhost:3000
```

###  Step 3: Login sebagai Admin
- **Username**: `admin`
- **Password**: `admin123`

###  Step 4: Pergi ke Admin > Manajemen Produk
- Klik "📦 Manajemen Produk" di menu
- Klik "+ Tambah Produk" untuk buat produk baru
- Atau klik "Edit" untuk ubah produk existing

###  Step 5: Isi Form
**Field yang wajib diisi:**
- ✅ Judul Produk
- ✅ Author
- ✅ Kategori
- ✅ Harga
- ✅ Stock ← **INI PENTING!**
- ⭕ Gambar (opsional)

Click "Simpan" atau "Update"

## 🔍 Test API Langsung
Untuk test tanpa frontend, jalankan:
```bash
node TEST_API.js
```

Ini akan:
1. Login sebagai admin
2. Lihat semua produk
3. **Add produk baru** dengan stock
4. **Update produk** 
5. Lihat hasil update

## ⚙️ Jika Masih Error

**Error 1: "Gagal update produk"**
- Pastikan backend running: `npm start` di folder backend
- Pastikan token valid (login dulu sebagai admin)

**Error 2: "Stock tidak berubah"**
- Refresh halaman setelah edit
- Pastikan backend menerima request (lihat console backend)

**Error 3: "Produk tidak muncul"**
- Database mungkin kosong
- Jalankan: `node TEST_API.js` untuk test dan lihat error aslinya

## 📊 Database yang Sudah Ada

Sudah tersimpan 10 produk:
1. Laskar Pelangi (Stock: 15)
2. Si Kancil (Stock: 22)
3. Negeri di Ujung Tanduk (Stock: 18)
4. Hansel dan Gretel (Stock: 25)
5. Malin Kundang (Stock: 20)
6. Roro Jonggrang (Stock: 12)
7. Dongeng Nusantara (Stock: 30)
8. Cerita Anak Nusantara (Stock: 8)
9. Dru dan Kisah Lima Kerajaan (Stock: 5)
10. Kumpulan Cerita Ragam Indonesia (Stock: 35)

## ✅ Semuanya Clean!
- Kode sudah di-restore ke state awal
- Database sudah terisi stock data
- Tidak ada perubahan yang aneh

**Silakan coba sekarang dan bilang jika ada error!** 🎯
