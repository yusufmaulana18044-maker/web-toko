# 📊 Data Migration Guide - PostgreSQL to Supabase

Panduan untuk migrasi data existing dari PostgreSQL lokal ke Supabase.

---

## 📋 Prerequisites

- PostgreSQL lokal sudah terinstall dan running
- Database `toko_bukuanyar` sudah ada dengan data
- Supabase project sudah dibuat
- Supabase SQL Editor sudah accessible

---

## 🔄 Migration Methods

Ada 3 metode migrasi data:

### Method 1: SQL Dump & Restore (RECOMMENDED)

**Langkah 1: Export data dari PostgreSQL**

```bash
# Export hanya data (tanpa struktur tabel)
pg_dump -U postgres -d toko_bukuanyar \
  --data-only \
  --disable-triggers \
  -t users -t categories -t products -t transactions \
  > data_backup.sql
```

**Langkah 2: Bersihkan INSERT statement**

Edit file `data_backup.sql`:

```bash
# Pada Windows
notepad data_backup.sql

# Atau Linux/Mac
nano data_backup.sql
```

Hapus line pertama berisi header comment SQL, atau pastikan dimulai dengan INSERT statement.

**Langkah 3: Import ke Supabase**

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Ke "SQL Editor"
4. Buat query baru
5. Copy-paste isi `data_backup.sql`
6. Jalankan query

---

### Method 2: Command Line Interface (Advanced)

**Menggunakan pgAdmin atau psql**

```bash
# Connect ke PostgreSQL
psql -U postgres -d toko_bukuanyar

# Dalam psql shell, copy data:
# \COPY users TO STDOUT WITH CSV HEADER > users.csv
# \COPY categories TO STDOUT WITH CSV HEADER > categories.csv
# \COPY products TO STDOUT WITH CSV HEADER > products.csv
# \COPY transactions TO STDOUT WITH CSV HEADER > transactions.csv
```

Kemudian import CSV ke Supabase:

1. Di Supabase Table Editor
2. Pilih tabel
3. Klik "Import data" → pilih CSV file

---

### Method 3: Manual via Supabase UI (Easiest)

**Langkah 1: Export dari PostgreSQL ke CSV**

```bash
# Using pg_dump
pg_dump -U postgres -d toko_bukuanyar \
  -t users --data-only --no-privileges > users.csv

# Setiap tabel:
# users.csv, categories.csv, products.csv, transactions.csv
```

**Langkah 2: Import CSV ke Supabase**

1. Buka Supabase (https://app.supabase.com)
2. Pilih project → "Table Editor"
3. Untuk setiap tabel:
   - Klik tabel
   - Klik "..." menu
   - Pilih "Import Data"
   - Pilih file CSV
   - Map kolom jika perlu
   - Klik "Import"

---

## 🛠️ Step-by-Step Migration

### STEP 1: Prepare Export

Buat folder untuk file backup:

```bash
# Windows
mkdir backup
cd backup

# Linux/Mac
mkdir backup
cd backup
```

### STEP 2: Export Users Table

```bash
psql -U postgres -d toko_bukuanyar -c \
  "COPY users(id, username, email, full_name, phone, password, role, is_approved, created_at) \
   TO STDOUT WITH CSV HEADER" > users.csv
```

Cek hasil:
```bash
head users.csv
```

### STEP 3: Export Categories Table

```bash
psql -U postgres -d toko_bukuanyar -c \
  "COPY categories(id, name, slug, description, created_at) \
   TO STDOUT WITH CSV HEADER" > categories.csv
```

### STEP 4: Export Products Table

```bash
psql -U postgres -d toko_bukuanyar -c \
  "COPY products(id, title, author, category, price, stock, image, created_at) \
   TO STDOUT WITH CSV HEADER" > products.csv
```

### STEP 5: Export Transactions Table

```bash
psql -U postgres -d toko_bukuanyar -c \
  "COPY transactions(id, user_id, transaction_code, items, total_amount, status, payment_method, created_at) \
   TO STDOUT WITH CSV HEADER" > transactions.csv
```

### STEP 6: Upload CSV ke Supabase

1. Buka Supabase Dashboard
2. Project → Table Editor
3. Untuk tabel `users`:
   - Klik tabel users
   - Menu "..." → "Import Data"
   - Pilih file `users.csv`
   - Verifikasi mapping kolom
   - Klik "Import"
4. Ulangi untuk categories, products, transactions

---

## 📝 Data Mapping

Pastikan kolom termap dengan benar saat import:

### Users Table

```
PostgreSQL Column  →  Supabase Column
id                 →  id
username           →  username
email              →  email
full_name          →  full_name
phone              →  phone
password           →  password
role               →  role
is_approved        →  is_approved
created_at         →  created_at
```

### Categories Table

```
id        →  id
name      →  name
slug      →  slug
description → description
created_at → created_at
```

### Products Table

```
id        →  id
title     →  title
author    →  author
category  →  category
price     →  price
stock     →  stock
image     →  image
created_at → created_at
```

### Transactions Table

```
id               →  id
user_id          →  user_id
transaction_code →  transaction_code
items            →  items (akan JSONB)
total_amount     →  total_amount
status           →  status
payment_method   →  payment_method
created_at       →  created_at
```

---

## ✅ Verify Migration

Setelah import, verifikasi data:

### Di Supabase SQL Editor

```sql
-- Check users
SELECT COUNT(*) as total_users FROM users;

-- Check categories
SELECT COUNT(*) as total_categories FROM categories;

-- Check products
SELECT COUNT(*) as total_products FROM products;

-- Check transactions
SELECT COUNT(*) as total_transactions FROM transactions;

-- Sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM products LIMIT 5;
```

### Via API

```bash
# Get users via API
curl http://localhost:5000/products

# Check dari database
psql -U postgres -d toko_bukuanyar -c "SELECT COUNT(*) FROM products;"
```

---

## 🔧 Troubleshooting Migration

### Problem: CSV Header not recognized

**Solution:** Pastikan CSV memiliki header row, atau set manually saat import di UI

```bash
# Tambah header jika tidak ada
head -1 users.csv
```

### Problem: Foreign Key error saat import

**Solution:** Import dalam urutan yang benar:
1. users (tidak ada foreign key)
2. categories
3. products
4. transactions (ada foreign key ke users)

### Problem: Data type mismatch

**Solution:** Cek tipe data di Supabase vs PostgreSQL:

```sql
-- Di Supabase SQL Editor
\d users;
\d products;
```

### Problem: Character encoding issue

**Solution:** Konversi CSV ke UTF-8:

```bash
iconv -f ISO-8859-1 -t UTF-8 users.csv > users_utf8.csv
```

---

## 🚀 Reverse Migration (Supabase → PostgreSQL)

Jika ingin migrasi balik dari Supabase ke PostgreSQL lokal:

### STEP 1: Export dari Supabase

Di Supabase SQL Editor:

```sql
-- Export users
\copy users TO '/tmp/users_supabase.csv' CSV HEADER;

-- Export categories
\copy categories TO '/tmp/categories_supabase.csv' CSV HEADER;

-- Export products
\copy products TO '/tmp/products_supabase.csv' CSV HEADER;

-- Export transactions
\copy transactions TO '/tmp/transactions_supabase.csv' CSV HEADER;
```

### STEP 2: Import ke PostgreSQL Lokal

```bash
psql -U postgres -d toko_bukuanyar

# Dalam psql:
\copy users FROM 'users_supabase.csv' CSV HEADER;
\copy categories FROM 'categories_supabase.csv' CSV HEADER;
\copy products FROM 'products_supabase.csv' CSV HEADER;
\copy transactions FROM 'transactions_supabase.csv' CSV HEADER;
```

---

## 📊 Migration Checklist

- [ ] PostgreSQL database siap dengan data
- [ ] Supabase project sudah dibuat dengan tabel structure
- [ ] Export data dari PostgreSQL ke CSV format
- [ ] CSV files sudah diverifikasi
- [ ] Upload CSV ke Supabase melalui UI atau SQL
- [ ] Verifikasi data count di kedua database
- [ ] Sample data check untuk akurasi
- [ ] Test API endpoint dengan data dari Supabase
- [ ] Update .env untuk point ke Supabase
- [ ] Restart server backend

---

## 🎯 Post-Migration

Setelah migration berhasil:

1. **Update Backend Configuration**
   ```env
   # Gunakan Supabase credentials
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=...
   ```

2. **Update Server Routes** - gunakan `server-supabase.js`

3. **Test All Endpoints**
   ```bash
   npm start
   curl http://localhost:5000/products
   ```

4. **Verify Frontend** - pastikan API calls bekerja dengan baik

5. **Backup Data Lama** - keep PostgreSQL backup untuk safety

---

## 💡 Tips

1. **Always backup first** - jangan hingga data hilang
2. **Test di development dulu** - jangan langsung production
3. **Verify data integrity** - check count dan sample data
4. **Keep both version** - jangan hapus PostgreSQL sampai yakin working

---

## 📞 Support

Jika ada masalah saat migration:

1. Check error message di Supabase UI
2. Verify CSV format (gunakan Excel untuk cek)
3. Test individual table import terlebih dahulu
4. Contact Supabase support jika perlu

---

## ✨ Selesai!

Data Anda sudah berhasil migrasi ke Supabase! 🎉

Server sekarang bisa point ke Supabase dan menggunakan kredensial dari Supabase.

