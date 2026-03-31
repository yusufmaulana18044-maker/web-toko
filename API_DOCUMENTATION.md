# 📖 API DOCUMENTATION - Web Toko dengan Supabase

## 📌 Base URL

```
http://localhost:5000
```

## 🔐 Authentication

Semua endpoint yang dilindungi memerlukan JWT token di header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 Authentication Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "admin",
    "is_approved": true
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

### 2. Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "08123456789",
  "password": "password123",
  "password_confirm": "password123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Menunggu approval dari kasir untuk bisa melakukan transaksi.",
  "user": {
    "id": 5,
    "username": "newuser",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_approved": false
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Username sudah terdaftar"
}
```

---

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 4. Get All Users (ADMIN ONLY)

**Endpoint:** `GET /auth/users/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "phone": "08123456789",
      "role": "admin",
      "is_approved": true,
      "created_at": "2026-03-31T10:00:00Z"
    },
    {
      "id": 2,
      "username": "kasir",
      "email": "kasir@example.com",
      "full_name": "Kasir User",
      "phone": "08123456790",
      "role": "kasir",
      "is_approved": true,
      "created_at": "2026-03-31T10:05:00Z"
    }
  ]
}
```

---

### 5. Get User Detail (ADMIN ONLY)

**Endpoint:** `GET /auth/users/:id`

**Parameters:**
- `id` (integer) - User ID

**Example:**
```
GET /auth/users/1
```

---

### 6. Update User Role (ADMIN ONLY)

**Endpoint:** `PATCH /auth/update-role`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": 5,
  "role": "kasir"
}
```

**Valid Roles:** `user`, `kasir`, `admin`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Role user berhasil diubah menjadi kasir",
  "data": {
    "id": 5,
    "username": "newuser",
    "role": "kasir",
    "is_approved": true
  }
}
```

---

### 7. Delete User (ADMIN ONLY)

**Endpoint:** `DELETE /auth/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

---

## 📦 Products Endpoints

### 1. Get All Products (PUBLIC)

**Endpoint:** `GET /products`

**Query Parameters (optional):**
- `limit` - Jumlah data
- `offset` - Offset data

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Cerita Rakyat Nusantara",
      "author": "Murti Bunanta",
      "category": "Cerita Rakyat",
      "price": 75000,
      "stock": 50,
      "image": "/images/book-1.jpg"
    },
    {
      "id": 2,
      "title": "Si Kancil Penggalau",
      "author": "Suwardi",
      "category": "Fabel",
      "price": 65000,
      "stock": 40,
      "image": "/images/book-2.jpg"
    }
  ]
}
```

---

### 2. Get Product Detail (PUBLIC)

**Endpoint:** `GET /products/:id`

**Parameters:**
- `id` (integer) - Product ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Cerita Rakyat Nusantara",
    "author": "Murti Bunanta",
    "category": "Cerita Rakyat",
    "price": 75000,
    "stock": 50,
    "image": "/images/book-1.jpg",
    "created_at": "2026-03-31T10:00:00Z"
  }
}
```

---

### 3. Create Product (ADMIN ONLY)

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Legenda Bukit Merah",
  "author": "Suciwati",
  "category": "Legenda",
  "price": 80000,
  "stock": 30,
  "image": "/images/book-3.jpg"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 11,
    "title": "Legenda Bukit Merah",
    "author": "Suciwati",
    "category": "Legenda",
    "price": 80000,
    "stock": 30,
    "image": "/images/book-3.jpg"
  }
}
```

---

### 4. Update Product (ADMIN ONLY)

**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 85000,
  "stock": 25
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil diupdate",
  "data": {
    "id": 1,
    "title": "Cerita Rakyat Nusantara",
    "price": 85000,
    "stock": 25
  }
}
```

---

### 5. Delete Product (ADMIN ONLY)

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil dihapus"
}
```

---

## 🏷️ Categories Endpoints

### 1. Get All Categories (PUBLIC)

**Endpoint:** `GET /categories`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cerita Rakyat",
      "slug": "cerita-rakyat",
      "description": "Koleksi cerita rakyat tradisional Indonesia"
    },
    {
      "id": 2,
      "name": "Fabel",
      "slug": "fabel",
      "description": "Cerita fabel dengan pesan moral"
    }
  ]
}
```

---

### 2. Get Category Detail (PUBLIC)

**Endpoint:** `GET /categories/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Cerita Rakyat",
    "slug": "cerita-rakyat",
    "description": "Koleksi cerita rakyat tradisional Indonesia",
    "created_at": "2026-03-31T10:00:00Z"
  }
}
```

---

### 3. Create Category (ADMIN ONLY)

**Endpoint:** `POST /categories`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Misteri",
  "slug": "misteri",
  "description": "Cerita misteri dan detektif"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "id": 9,
    "name": "Misteri",
    "slug": "misteri",
    "description": "Cerita misteri dan detektif"
  }
}
```

---

### 4. Update Category (ADMIN ONLY)

**Endpoint:** `PUT /categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Misteri & Detektif",
  "description": "Cerita misteri dan detektif yang seru"
}
```

---

### 5. Delete Category (ADMIN ONLY)

**Endpoint:** `DELETE /categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 💳 Transactions Endpoints

### 1. Get All Transactions

**Endpoint:** `GET /transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Authorization:**
- `user` - hanya transaksi milik sendiri
- `kasir` - semua transaksi
- `admin` - semua transaksi

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 3,
      "transaction_code": "ORDER-1711875600000",
      "items": [
        {
          "id": 1,
          "title": "Cerita Rakyat Nusantara",
          "qty": 2,
          "price": 75000
        }
      ],
      "total_amount": 150000,
      "status": "completed",
      "payment_method": "cash",
      "created_at": "2026-03-31T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Transaction Detail

**Endpoint:** `GET /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Authorization:**
- `user` - hanya transaksi milik sendiri
- `kasir` & `admin` - semua transaksi

---

### 3. Create Transaction (KASIR & ADMIN ONLY)

**Endpoint:** `POST /transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": 3,
  "items": [
    {
      "id": 1,
      "title": "Cerita Rakyat Nusantara",
      "qty": 1,
      "price": 75000
    }
  ],
  "total_amount": 75000,
  "status": "completed",
  "payment_method": "cash"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "id": 5,
    "user_id": 3,
    "transaction_code": "ORDER-1711875600000-abc12",
    "items": [...],
    "total_amount": 75000,
    "status": "completed",
    "created_at": "2026-03-31T10:15:00Z"
  }
}
```

---

### 4. Update Transaction (KASIR & ADMIN ONLY)

**Endpoint:** `PUT /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "pending",
  "payment_method": "bank_transfer"
}
```

---

### 5. Delete Transaction (KASIR & ADMIN ONLY)

**Endpoint:** `DELETE /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🛒 Checkout Endpoint

### Create Order

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Cerita Rakyat Nusantara",
      "qty": 1,
      "price": 75000
    }
  ],
  "total": 75000
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "transaction_code": "ORDER-1711875654321",
    "items": [...],
    "total": 75000,
    "status": "pending",
    "created_at": "2026-03-31T10:20:00Z"
  }
}
```

---

## 🧪 Testing dengan cURL

### 1. Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Get Products (dengan token)

```bash
curl -X GET http://localhost:5000/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create Product (ADMIN)

```bash
curl -X POST http://localhost:5000/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cerita Baru",
    "author": "Pengarang",
    "category": "Cerita Rakyat",
    "price": 90000,
    "stock": 20
  }'
```

### 4. Create Transaction (KASIR)

```bash
curl -X POST http://localhost:5000/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 3,
    "items": [{"id": 1, "title": "Buku A", "qty": 1, "price": 75000}],
    "total_amount": 75000,
    "status": "completed",
    "payment_method": "cash"
  }'
```

### 5. Customer Checkout

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"id": 1, "title": "Buku A", "qty": 1, "price": 75000}
    ],
    "total": 75000
  }'
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Field wajib: title, author, category, price"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Server error: [error details]"
}
```

---

## 🔐 Authorization Matrix

| Endpoint | Public | User | Kasir | Admin |
|----------|--------|------|-------|-------|
| GET /products | ✅ | ✅ | ✅ | ✅ |
| POST /products | ❌ | ❌ | ❌ | ✅ |
| PUT /products/:id | ❌ | ❌ | ❌ | ✅ |
| DELETE /products/:id | ❌ | ❌ | ❌ | ✅ |
| GET /transactions | ❌ | ✅* | ✅ | ✅ |
| POST /transactions | ❌ | ❌ | ✅ | ✅ |
| GET /auth/users | ❌ | ❌ | ❌ | ✅ |
| POST /api/orders | ✅ | ✅ | ✅ | ✅ |

*User hanya bisa lihat transaksi milik sendiri

---

## 📚 Test Credentials

```
Username: admin
Password: admin123
Role: admin

---

Username: kasir
Password: kasir123
Role: kasir

---

Username: user
Password: user123
Role: user
```

---

## 🚀 Quick Start

1. **Login untuk mendapat token:**
   ```bash
   curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

2. **Gunakan token di header Authorization:**
   ```bash
   Authorization: Bearer <token_dari_response>
   ```

3. **Akses protected endpoints dengan token**

---

Untuk pertanyaan lebih lanjut, lihat file `SUPABASE_GUIDE.md`

