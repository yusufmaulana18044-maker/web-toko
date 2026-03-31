# 📚 SUPABASE INTEGRATION GUIDE

## 🎯 Pengenalan Supabase

Supabase adalah Backend-as-a-Service (BaaS) yang menyediakan:
- PostgreSQL Database (hosted)
- Authentication API
- Real-time subscriptions
- File Storage
- Vector/Embeddings

Project ini mengintegrasikan Supabase sebagai database alternative dari PostgreSQL lokal.

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

1. **Akun Supabase** - Daftar di https://supabase.com
2. **Node.js & npm** - Sudah terinstall
3. **Existing Project** - Web Toko yang sudah ada

---

## 🚀 STEP 1: Setup Database di Supabase

### 1.1 Membuat Project Baru

1. Login ke https://app.supabase.com
2. Klik "New Project"
3. Isi form:
   ```
   Project name: web-toko
   Database Password: [Pilih password yang kuat]
   Region: Singapore (atau terdekat dengan lokasi Anda)
   ```
4. Tunggu 2-3 menit sampai project siap

### 1.2 Mendapatkan Credentials

1. Di menu sidebar, klik "Settings" → "API"
2. Copy dan catat:
   - **Project URL**: https://xxxxx.supabase.co
   - **Anon Key**: eyJhbGciOiJIUzI1NiIs...
   - **Service Role Key**: eyJhbGciOiJIUzI1NiIs...

### 1.3 Membuat Tabel di Supabase

Gunakan SQL Editor di Supabase untuk membuat tabel:

**1. Tabel USERS**

```sql
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'kasir')),
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by BIGINT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index untuk faster queries
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

**2. Tabel CATEGORIES**

```sql
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

**3. Tabel PRODUCTS**

```sql
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

CREATE INDEX idx_products_category ON products(category);
```

**4. Tabel TRANSACTIONS**

```sql
CREATE TABLE public.transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  transaction_code VARCHAR(50) UNIQUE,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  payment_method VARCHAR(50),
  shipping_address VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

## ⚙️ STEP 2: Setup di Backend

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

Ini akan install:
- `@supabase/supabase-js` - Supabase JavaScript client
- `dotenv` - Environment variable loader

### 2.2 Konfigurasi Environment (.env)

1. Buka file `.env` di root project
2. Isi dengan credentials dari Supabase:

```env
# SUPABASE
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...

# JWT
JWT_SECRET=rahasia_jwt_super_aman_123456

# SERVER
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 2.3 Struktur File Baru

File-file berikut telah dibuat:

```
backend/
├── db/
│   ├── supabase.js          ← NEW: Supabase client config
│   ├── db.js                ← EXISTING: PostgreSQL (bisa dihapus)
│   └── schema.js            ← EXISTING: Schema creator (bisa dihapus)
│
├── routes/
│   ├── auth-supabase.js     ← NEW: Auth dengan Supabase
│   ├── products-supabase.js ← NEW: Products dengan Supabase
│   ├── categories-supabase.js ← NEW: Categories dengan Supabase
│   ├── transactions-supabase.js ← NEW: Transactions dengan Supabase
│   │
│   ├── auth.js              ← EXISTING: Auth dengan PostgreSQL
│   ├── products.js          ← EXISTING: Products dengan PostgreSQL
│   ├── categories.js        ← EXISTING: Categories dengan PostgreSQL
│   └── transactions.js      ← EXISTING: Transactions dengan PostgreSQL
│
└── server-supabase.js       ← NEW: Server dengan Supabase routes
```

---

## 🔄 STEP 3: Migrasi Data dari PostgreSQL ke Supabase

Jika sudah ada data di PostgreSQL lokal, ikuti langkah ini:

### 3.1 Export Data dari PostgreSQL

```bash
# Export semua tabel ke CSV
pg_dump -U postgres -d toko_bukuanyar -t users -t categories -t products -t transactions \
  --no-owner --no-privileges > backup.sql
```

### 3.2 Import ke Supabase

1. Buka SQL Editor di Supabase Dashboard
2. Copy-paste data dari file backup
3. Atau gunakan Studio interface untuk import CSV

---

## 📝 STEP 4: Update Server File

### Option A: Create New Server File (Recommended)

Buat file baru `backend/server-supabase.js`:

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../login-dashboard/public")));

// Routes dengan Supabase
const authSupabaseRoutes = require("./routes/auth-supabase");
const productsSupabaseRoutes = require("./routes/products-supabase");
const categoriesSupabaseRoutes = require("./routes/categories-supabase");
const transactionsSupabaseRoutes = require("./routes/transactions-supabase");

app.get("/", (req, res) => {
  res.send("🚀 API Web Toko dengan Supabase aktif!");
});

app.use("/auth", authSupabaseRoutes);
app.use("/products", productsSupabaseRoutes);
app.use("/categories", categoriesSupabaseRoutes);
app.use("/transactions", transactionsSupabaseRoutes);

// Checkout endpoint
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: "Items dan total wajib diisi"
      });
    }

    res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      data: {
        transaction_code: `ORDER-${Date.now()}`,
        items,
        total,
        status: "pending",
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Mode: Supabase`);
});
```

### Option B: Update Existing server.js

Edit `backend/server.js` dan ganti imports:

```javascript
// Sebelum:
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const transactionRoutes = require("./routes/transactions");

// Sesudah:
const productRoutes = require("./routes/products-supabase");
const authRoutes = require("./routes/auth-supabase");
const categoryRoutes = require("./routes/categories-supabase");
const transactionRoutes = require("./routes/transactions-supabase");
```

---

## ▶️ STEP 5: Menjalankan Server

### Development Mode

```bash
cd backend
npm start
```

Atau dengan nodemon (lebih praktis saat development):

```bash
npm install -D nodemon
npx nodemon server.js
```

### Testing

```bash
# Test login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test get products
curl http://localhost:5000/products

# Test get categories
curl http://localhost:5000/categories
```

---

## 🧪 STEP 6: Testing & Troubleshooting

### Common Issues & Solutions

**Issue 1: "SUPABASE_URL dan SUPABASE_ANON_KEY harus diset di .env"**

```bash
# Solution: Pastikan .env file sudah dibuat dan diisi dengan benar
# Cek file .env di root project
cat .env
```

**Issue 2: "Error: supabase is not a function"**

```bash
# Solution: Pastikan import benar di file route
const { supabase } = require("../db/supabase");
```

**Issue 3: "Column 'xxx' does not exist"**

```bash
# Solution: Pastikan semua tabel dan kolom sudah dibuat di Supabase
# Run SQL di Supabase SQL Editor
```

**Issue 4: "403 Permission denied"**

```bash
# Solution: Check Row Level Security (RLS) di Supabase Dashboard
# Supabase > Project > SQL Editor > Check RLS policies
```

### Debug Mode

Set NODE_ENV untuk melihat error lebih detail:

```bash
NODE_ENV=development npm start
```

---

## 📊 API Endpoints dengan Supabase

### Authentication

```
POST   /auth/login              - Login user
POST   /auth/register           - Register user baru
POST   /auth/logout             - Logout (client-side)
GET    /auth/users/             - Get all users (ADMIN)
GET    /auth/users/:id          - Get user detail (ADMIN)
PATCH  /auth/update-role        - Update user role (ADMIN)
DELETE /auth/users/:id          - Delete user (ADMIN)
```

### Products

```
GET    /products                - Get all products (PUBLIC)
GET    /products/:id            - Get product detail (PUBLIC)
POST   /products                - Create product (ADMIN)
PUT    /products/:id            - Update product (ADMIN)
DELETE /products/:id            - Delete product (ADMIN)
```

### Categories

```
GET    /categories              - Get all categories (PUBLIC)
GET    /categories/:id          - Get category detail (PUBLIC)
POST   /categories              - Create category (ADMIN)
PUT    /categories/:id          - Update category (ADMIN)
DELETE /categories/:id          - Delete category (ADMIN)
```

### Transactions

```
GET    /transactions            - Get transactions (filtered by role)
GET    /transactions/:id        - Get transaction detail
POST   /transactions            - Create transaction (KASIR/ADMIN)
PUT    /transactions/:id        - Update transaction (KASIR/ADMIN)
DELETE /transactions/:id        - Delete transaction (KASIR/ADMIN)
POST   /api/orders              - Customer checkout (PUBLIC)
```

---

## 🔐 Security Best Practices

### 1. Row Level Security (RLS)

Aktifkan RLS di Supabase untuk setiap tabel:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy contoh: User hanya bisa lihat transaksi milik sendiri
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

### 2. Protected Routes

Semua routes yang modifikasi data sudah dilindungi dengan:
- JWT token verification
- Role-based access control
- Input validation

### 3. Environment Variables

Jangan pernah commit `.env` ke Git:

```bash
# Pastikan .env ada di .gitignore
echo ".env" >> .gitignore
```

---

## 📚 Dokumentasi Lebih Lanjut

- [Supabase Official Docs](https://supabase.com/docs)
- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ✅ Checklist Setup Supabase

- [ ] Buat akun Supabase dan project baru
- [ ] Copy Supabase URL dan API keys
- [ ] Buat tabel di Supabase (users, categories, products, transactions)
- [ ] Update file `.env` dengan credentials Supabase
- [ ] Run `npm install` di folder backend
- [ ] Start server: `npm start`
- [ ] Test endpoints dengan curl/Postman
- [ ] Update frontend API base URL jika perlu
- [ ] Deploy ke production

---

## 🎉 Selesai!

Server backend Anda sekarang berjalan dengan Supabase! 🚀

Untuk pertanyaan lebih lanjut:
- Baca dokumentasi resmi Supabase
- Cek logs di terminal untuk error messages
- Gunakan Supabase Dashboard untuk debugging

