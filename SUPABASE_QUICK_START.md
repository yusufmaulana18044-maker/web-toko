# 🚀 QUICK START - Supabase Integration

Panduan singkat untuk setup Supabase di Web Toko dalam 5 langkah.

---

## ⚡ 5 Langkah Setup Cepat

### STEP 1: Setup Supabase (2 menit)

```bash
# 1. Buka https://supabase.com dan login
# 2. Buat project baru: "web-toko"
# 3. Tunggu setup selesai (2-3 menit)
# 4. Di menu "Settings" → "API" copy credentials:
#    - SUPABASE_URL
#    - SUPABASE_ANON_KEY
```

### STEP 2: Buat Tabel di Supabase (3 menit)

Di Supabase Dashboard, buka "SQL Editor" dan jalankan script di bawah:

```sql
-- TABEL USERS
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'kasir')),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABEL CATEGORIES
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABEL PRODUCTS
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABEL TRANSACTIONS
CREATE TABLE public.transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  transaction_code VARCHAR(50) UNIQUE,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### STEP 3: Update .env File (1 menit)

Edit file `.env` di root project:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=xxxxx
JWT_SECRET=rahasia_jwt_super_aman_123456
PORT=5000
NODE_ENV=development
```

### STEP 4: Install Dependencies (2 menit)

```bash
cd backend
npm install
```

### STEP 5: Jalankan Server (1 menit)

```bash
npm start
```

Jika ada di folder lain:
```bash
node backend/server-supabase.js
```

---

## ✅ Verification Checklist

Setelah setup, pastikan semua ini OK:

- [ ] File `.env` sudah dibuat dan diisi credentials Supabase
- [ ] Folder `backend/db/supabase.js` ada dan berisi konfigurasi
- [ ] File `backend/routes/auth-supabase.js`, `products-supabase.js`, etc sudah ada
- [ ] `npm install` sudah dijalankan di folder backend
- [ ] Server berjalan tanpa error: `npm start`
- [ ] Test endpoint: `curl http://localhost:5000`

---

## 🧪 Test API Endpoints

Setelah server berjalan, test dengan cURL atau Postman:

### 1. Get Products (PUBLIC)

```bash
curl http://localhost:5000/products
```

### 2. Get Categories (PUBLIC)

```bash
curl http://localhost:5000/categories
```

### 3. Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Resp akan berisi token JWT. Catat token ini untuk test endpoint lainnya.

### 4. Get All Users (ADMIN - perlu token)

```bash
curl -H "Authorization: Bearer TOKEN_DARI_LOGIN" \
  http://localhost:5000/auth/users/
```

---

## 📁 File Structure Baru

```
Web Toko/
├── .env                           ← NEW: Credentials Supabase
├── .env.example                   ← NEW: Template .env
├── API_DOCUMENTATION.md           ← NEW: Dokumentasi API lengkap
├── SUPABASE_GUIDE.md             ← NEW: Panduan setup Supabase detail
│
└── backend/
    ├── package.json               ← MODIFIED: Added @supabase/supabase-js
    ├── server-supabase.js         ← NEW: Server dengan Supabase routes
    │
    ├── db/
    │   ├── supabase.js            ← NEW: Supabase client config
    │   ├── db.js                  ← EXISTING: PostgreSQL (bisa dihapus)
    │   └── schema.js              ← EXISTING: Schema creator (bisa dihapus)
    │
    └── routes/
        ├── auth-supabase.js       ← NEW: Auth routes
        ├── products-supabase.js   ← NEW: Products routes
        ├── categories-supabase.js ← NEW: Categories routes
        ├── transactions-supabase.js ← NEW: Transactions routes
        └── [old routes]           ← EXISTING: Dual compatibility
```

---

## 🔄 Migrasi Data (Optional)

Jika sudah ada data di PostgreSQL lokal dan ingin migrasi ke Supabase:

```bash
# 1. Export data dari PostgreSQL
pg_dump -U postgres -d toko_bukuanyar -t users -t products -t categories -t transactions > backup.sql

# 2. Import ke Supabase
# Buka Supabase SQL Editor dan paste isi file backup.sql
# Atau gunakan CLI Supabase:
supabase db push
```

---

## 🆘 Troubleshooting

### Error: "SUPABASE_URL dan SUPABASE_ANON_KEY harus diset di .env"

**Solusi:** Pastikan file `.env` ada di root project dan berisi credentials Supabase

```bash
# Check file .env
cat .env

# Atau pada Windows
type .env
```

### Error: "Cannot find module '@supabase/supabase-js'"

**Solusi:** Install dependencies

```bash
cd backend
npm install
```

### Error: "Column 'xxx' does not exist"

**Solusi:** Tabel belum dibuat. Jalankan SQL script di Supabase SQL Editor (lihat STEP 2)

### Server berjalan tapi tidak bisa connect ke Supabase

**Solusi:**
1. Check apakah SUPABASE_URL dan SUPABASE_ANON_KEY benar
2. Check koneksi internet
3. Cek RLS policies di Supabase (jika diaktifkan)

---

## 📊 API Endpoints Reference

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `GET /auth/users/` - Get all users (ADMIN)

### Products
- `GET /products` - Get all (PUBLIC)
- `POST /products` - Create (ADMIN)
- `PUT /products/:id` - Update (ADMIN)
- `DELETE /products/:id` - Delete (ADMIN)

### Categories
- `GET /categories` - Get all (PUBLIC)
- `POST /categories` - Create (ADMIN)
- `PUT /categories/:id` - Update (ADMIN)
- `DELETE /categories/:id` - Delete (ADMIN)

### Transactions
- `GET /transactions` - Get all (filtered by role)
- `POST /transactions` - Create (KASIR/ADMIN)
- `GET /transactions/:id` - Get detail
- `PUT /transactions/:id` - Update (KASIR/ADMIN)
- `DELETE /transactions/:id` - Delete (KASIR/ADMIN)

### Checkout
- `POST /api/orders` - Create order (PUBLIC)

---

## 📚 Default Test Credentials

Gunakan credentials ini untuk testing:

```
Admin:
  Username: admin
  Password: admin123

Kasir:
  Username: kasir
  Password: kasir123

User:
  Username: user
  Password: user123
```

---

## 🎯 Next Steps

Setelah setup berhasil:

1. ✅ Test semua endpoints dengan cURL/Postman
2. ✅ Update frontend API base URL ke `http://localhost:5000` (jika belum)
3. ✅ Test login dan authorization
4. ✅ Test CRUD operations (Create, Read, Update, Delete)
5. ✅ Migrata data dari PostgreSQL (jika ada)

---

## 📖 Dokumentasi Lengkap

- **Setup Detail:** Baca `SUPABASE_GUIDE.md`
- **API Reference:** Baca `API_DOCUMENTATION.md`
- **Troubleshooting:** Baca section "Troubleshooting" di SUPABASE_GUIDE.md

---

## ❓ FAQ

**Q: Berapa biaya Supabase?**
A: Supabase gratis untuk project kecil. Free tier sudah cukup untuk development.

**Q: Apakah harus menghapus PostgreSQL lokal?**
A: Tidak perlu. Bisa pakai keduanya atau pilih satu saja sesuai kebutuhan.

**Q: Bagaimana cara backup data di Supabase?**
A: Supabase otomatis backup setiap hari. Bisa juga manual export di UI.

**Q: Bisa migrasi balik dari Supabase ke PostgreSQL?**
A: Bisa, export data dari Supabase import ke PostgreSQL lokal.

---

## 🎉 Selesai!

Server backend Anda sekarang siap dengan Supabase! 🚀

Untuk bantuan lebih lanjut:
- Buka `SUPABASE_GUIDE.md` untuk detail setup
- Buka `API_DOCUMENTATION.md` untuk API reference
- Untuk error, cek terminal logs

Happy coding! 💻

