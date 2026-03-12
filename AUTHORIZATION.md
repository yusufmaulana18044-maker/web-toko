# 🔐 Authorization & Role-Based Access Control (RBAC)

## Overview
Aplikasi Web Toko mengimplementasikan Role-Based Access Control dengan 3 role utama:
- **USER** (Customer/Pelanggan)
- **KASIR** (Cashier/Staff)
- **ADMIN** (Administrator)

---

## 📋 Role Permissions

### 1. USER (Pelanggan)

**Deskripsi**: Pengguna reguler yang dapat berbelanja dan melihat riwayat transaksi pribadi.

#### Permissions:

| Endpoint | Method | Access | Deskripsi |
|----------|--------|--------|-----------|
| `/products` | GET | ✅ PUBLIC | Lihat semua produk |
| `/categories` | GET | ✅ PUBLIC | Lihat semua kategori |
| `/api/orders` | POST | ✅ LOGIN | Buat order/checkout |
| `/transactions` | GET | ✅ LOGIN | Lihat transaksi diri sendiri |
| `/transactions/:id` | GET | ✅ LOGIN | Lihat detail transaksi miliknya |
| **Semua operasi lain** | - | ❌ DENIED | Dilarang |

#### Contoh Response:
```json
// GET /transactions (user)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "transaction_code": "TRX-001-2026",
      "status": "paid",
      "total_amount": 150000
    }
  ]
}
```

---

### 2. KASIR (Cashier/Staff)

**Deskripsi**: Staff penjualan yang mengelola transaksi pelanggan.

#### Permissions:

| Endpoint | Method | Access | Deskripsi |
|----------|--------|--------|-----------|
| `/products` | GET | ✅ PUBLIC | Lihat semua produk |
| `/categories` | GET | ✅ PUBLIC | Lihat semua kategori |
| `/transactions` | GET | ✅ LOGIN | Lihat SEMUA transaksi |
| `/transactions/:id` | GET | ✅ LOGIN | Lihat detail transaksi apapun |
| `/transactions` | POST | ✅ LOGIN | Buat transaksi baru |
| `/transactions/:id` | PUT | ✅ LOGIN | Update status transaksi |
| `/transactions/:id` | DELETE | ✅ LOGIN | Cancel transaksi |
| **Manage Products** | - | ❌ DENIED | Dilarang |
| **Manage Categories** | - | ❌ DENIED | Dilarang |
| **Manage Users** | - | ❌ DENIED | Dilarang |

#### Contoh Response:
```json
// POST /transactions (kasir)
{
  "success": true,
  "message": "Transaksi berhasil dibuat oleh kasir",
  "data": {
    "id": 1645348200000,
    "user_id": 2,
    "transaction_code": "TRX-1645348200000-2026",
    "total_amount": 150000,
    "status": "pending"
  }
}
```

---

### 3. ADMIN (Administrator)

**Deskripsi**: Administrator sistem yang mengelola produk, kategori, dan user.

#### Permissions:

| Endpoint | Method | Access | Deskripsi |
|----------|--------|--------|-----------|
| `/products` | GET | ✅ PUBLIC | Lihat semua produk |
| `/products` | POST | ✅ LOGIN | Create produk baru |
| `/products/:id` | PUT | ✅ LOGIN | Update produk |
| `/products/:id` | DELETE | ✅ LOGIN | Delete produk |
| `/categories` | GET | ✅ PUBLIC | Lihat semua kategori |
| `/categories` | POST | ✅ LOGIN | Create kategori baru |
| `/categories/:id` | PUT | ✅ LOGIN | Update kategori |
| `/categories/:id` | DELETE | ✅ LOGIN | Delete kategori |
| `/auth/users` | GET | ✅ LOGIN | Lihat semua users |
| `/auth/users/:id` | GET | ✅ LOGIN | Lihat detail user |
| `/auth/users/:id` | DELETE | ✅ LOGIN | Delete user |
| `/auth/update-role` | PATCH | ✅ LOGIN | Update role user |
| **Manage Transactions** | - | ❌ DENIED | Dilarang |

#### Contoh Response:
```json
// POST /products (admin)
{
  "success": true,
  "message": "Produk berhasil ditambahkan",
  "data": {
    "title": "Cerita Rakyat Nusantara",
    "author": "Murti Bunanta",
    "category_name": "Cerita Rakyat",
    "price": 75000
  }
}
```

---

## 🔑 Authentication Flow

### 1. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john",
    "role": "user"
  }
}
```

### 2. Authorization Header
Semua request yang memerlukan authentication harus include header:
```
Authorization: Bearer <token>
```

### 3. Token Validation
- Token valid selama 24 jam
- Token disimpan di localStorage (frontend)
- Token di-blacklist saat logout

---

## 🚫 Authorization Checks

### Middleware Auth (backend/middleware/auth.js)

```javascript
// Verify Token - semua endpoint yang perlu login uses ini
const verifyToken = (req, res, next) => { ... }

// Check Role - memastikan user punya role yang sesuai
const checkRole = (...allowedRoles) => { ... }

// Contoh penggunaan:
router.post("/products", verifyToken, checkRole("admin"), createProduct);
router.post("/transactions", verifyToken, checkRole("kasir"), createTransaction);
```

### Authorization Constants

```javascript
const ROLES = {
  USER: "user",      // Pelanggan
  KASIR: "kasir",    // Cashier
  ADMIN: "admin"     // Administrator
};
```

---

## 📊 Access Matrix

```
┌─────────────────────────┬────────┬───────┬───────┐
│ Endpoint                │  USER  │ KASIR │ ADMIN │
├─────────────────────────┼────────┼───────┼───────┤
│ GET /products           │   ✅   │  ✅   │  ✅   │
│ POST /products          │   ❌   │  ❌   │  ✅   │
│ PUT /products/:id       │   ❌   │  ❌   │  ✅   │
│ DELETE /products/:id    │   ❌   │  ❌   │  ✅   │
├─────────────────────────┼────────┼───────┼───────┤
│ GET /categories         │   ✅   │  ✅   │  ✅   │
│ POST /categories        │   ❌   │  ❌   │  ✅   │
│ PUT /categories/:id     │   ❌   │  ❌   │  ✅   │
│ DELETE /categories/:id  │   ❌   │  ❌   │  ✅   │
├─────────────────────────┼────────┼───────┼───────┤
│ GET /transactions       │ Sendiri│  Semua│  ❌   │
│ POST /transactions      │   ❌   │  ✅   │  ❌   │
│ PUT /transactions/:id   │   ❌   │  ✅   │  ❌   │
│ DELETE /transactions/:id│   ❌   │  ✅   │  ❌   │
├─────────────────────────┼────────┼───────┼───────┤
│ GET /auth/users         │   ❌   │  ❌   │  ✅   │
│ DELETE /auth/users/:id  │   ❌   │  ❌   │  ✅   │
│ PATCH /auth/update-role │   ❌   │  ❌   │  ✅   │
└─────────────────────────┴────────┴───────┴───────┘
```

---

## 🔄 Typical User Workflows

### Customer Shopping Flow
1. **Register** → `/auth/register`
2. **Login** → `/auth/login`
3. **Browse products** → `GET /products` (no auth needed)
4. **Checkout** → `POST /api/orders` (with token)
5. **See transactions** → `GET /transactions` (filtered by user_id)

### Cashier Transaction Flow
1. **Login** → `/auth/login`
2. **View all transactions** → `GET /transactions`
3. **Create new transaction** → `POST /transactions`
4. **Update transaction status** → `PUT /transactions/:id`
5. **Cancel transaction** → `DELETE /transactions/:id`

### Admin Management Flow
1. **Login** → `/auth/login`
2. **Manage Products** → POST/PUT/DELETE `/products`
3. **Manage Categories** → POST/PUT/DELETE `/categories`
4. **Manage Users** → GET/DELETE `/auth/users`, PATCH `/auth/update-role`

---

## ⚠️ Error Messages

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Akses ditolak. Role yang diizinkan: admin"
}
```

```json
{
  "success": false,
  "message": "Admin tidak memiliki akses ke transaksi management"
}
```

---

## 🛡️ Security Best Practices

1. **Token Management**
   - Token disimpan di localStorage
   - Token dihapus saat logout
   - Token di-blacklist (no reuse after logout)

2. **Password Security**
   - Password di-hash menggunakan bcryptjs
   - Minimal 6 karakter
   - Tidak pernah di-transmit dalam response

3. **Authorization Checks**
   - Semua endpoint check authentication
   - Authorization diperiksa di middleware
   - Admin checks untuk sensitive operations

4. **Rate Limiting** (Recommended for production)
   - Limit login attempts
   - Limit API requests per user

---

## 🔧 Configuration

### Backend Environment Variables
```
REACT_APP_API_URL=http://localhost:5000
JWT_SECRET=rahasia_jwt
JWT_EXPIRE=24h
```

### Frontend Storage
```javascript
// Login success
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

// Logout
localStorage.removeItem("token");
localStorage.removeItem("user");
```

---

## 📞 Support & Testing

### Test Login Credentials

**Admin Account**
```
Username: admin
Password: admin123
Role: admin
```

**Kasir Account**
```
Username: kasir
Password: kasir123
Role: kasir
```

**User Account**
```
Username: user
Password: user123
Role: user
```

### Test API Endpoints
```bash
# Get token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/auth/users
```

---

## 📝 Summary

| Role | Can View | Can Create | Can Edit | Can Delete | Can't Access |
|------|----------|-----------|----------|-----------|--------------|
| **USER** | Products, Categories, Own Transactions | Orders | - | - | Products, Categories, Transactions, Users |
| **KASIR** | Products, Categories, All Transactions | Transactions | Transactions | Transactions | Products, Categories, Users |
| **ADMIN** | Products, Categories, Users | Products, Categories | Products, Categories, Users | Products, Categories, Users | Transactions |

**Status**: ✅ **AUTHORIZATION IMPLEMENTED & ENFORCED**

Last Updated: March 9, 2026
