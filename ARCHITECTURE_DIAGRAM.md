# 🎯 Authorization Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WEB TOKO APPLICATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  FRONTEND (localhost:3000)                                          │
│  ├─ Login Page (Public)                                             │
│  ├─ Register Page (Public)                                          │
│  └─ Dashboard (Protected)                                           │
│     ├─ /dashboard (USER, KASIR, ADMIN)                             │
│     ├─ /admin/products (ADMIN ONLY)                                 │
│     ├─ /admin/categories (ADMIN ONLY)                               │
│     └─ /admin/users (ADMIN ONLY)                                    │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  BACKEND (localhost:5000)                                           │
│  ├─ Authentication (/auth)                                          │
│  │  ├─ POST /register (Public)                                      │
│  │  ├─ POST /login (Public)                                         │
│  │  ├─ POST /logout (Auth)                                          │
│  │  └─ Users Management (ADMIN ONLY)                               │
│  │     ├─ GET /users                                                │
│  │     ├─ DELETE /users/:id                                         │
│  │     └─ PATCH /update-role                                        │
│  │                                                                    │
│  ├─ Products (/products)                                            │
│  │  ├─ GET / (Public)                                               │
│  │  ├─ POST / (ADMIN ONLY)                                          │
│  │  ├─ PUT /:id (ADMIN ONLY)                                        │
│  │  └─ DELETE /:id (ADMIN ONLY)                                     │
│  │                                                                    │
│  ├─ Categories (/categories)                                        │
│  │  ├─ GET / (Public)                                               │
│  │  ├─ POST / (ADMIN ONLY)                                          │
│  │  ├─ PUT /:id (ADMIN ONLY)                                        │
│  │  └─ DELETE /:id (ADMIN ONLY)                                     │
│  │                                                                    │
│  ├─ Transactions (/transactions)                                    │
│  │  ├─ GET / (KASIR: all, USER: own)                               │
│  │  ├─ GET /:id (KASIR: all, USER: own)                            │
│  │  ├─ POST / (KASIR ONLY)                                          │
│  │  ├─ PUT /:id (KASIR ONLY)                                        │
│  │  └─ DELETE /:id (KASIR ONLY)                                     │
│  │  ✗ ADMIN: BLOCKED                                                │
│  │                                                                    │
│  └─ Orders (/api/orders)                                            │
│     └─ POST / (PUBLIC - Customer Checkout)                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow with Authorization

### USER (Customer) Flow
```
User                      Frontend               Middleware           Backend
│                         │                      │                    │
├─ Login                  │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ POST /auth/login    │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify username   │
│                         │                      ├─ Hash password     │
│                         │                      │                    │
│                         │<─────────────────────┤ Return JWT Token   │
│                         │<─────────────────────┤                    │
│<──────────────────────────────────────────────┤                    │
│ Store token in           │                      │                    │
│ localStorage             │                      │                    │
│                         │                      │                    │
├─ Browse Products        │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /products       │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Public endpoint   │
│                         │                      │ (no auth needed)   │
│                         │<─────────────────────┤ Return products    │
│                         │<─────────────────────┤                    │
│<──────────────────────────────────────────────┤                    │
│ Show products list       │                      │                    │
│                         │                      │                    │
├─ Checkout               │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ POST /api/orders    │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Public endpoint   │
│                         │                      │                    │
│                         │<─────────────────────┤ Return order       │
│<──────────────────────────────────────────────┤                    │
│ Show receipt             │                      │                    │
│                         │                      │                    │
├─ View My Transactions   │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /transactions   │                    │
│                         ├─ Token in header     │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check Role: user │
│                         │                      │ Filter by user_id │
│                         │<─────────────────────┤ Return own txn    │
│<──────────────────────────────────────────────┤                    │
│ Show own transactions    │                      │                    │
│                         │                      │                    │
├─ Try to view products   │                      │                    │
│   management page        │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /admin/products │                    │
│                         │ (Protected Route)    │                    │
│                         ├─ Check: role=admin? │                    │
│                         │ ✗ user role         │                    │
│                         │<─ Redirect to login  │                    │
│<──────────────────────────────────────────────┤                    │
│ Redirected to /         │                      │                    │
```

### ADMIN Flow - Blocking Transaction Access
```
Admin                     Frontend               Middleware           Backend
│                         │                      │                    │
├─ Login as Admin         │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ POST /auth/login    │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Return JWT Token  │
│                         │                      │ role: "admin"      │
│<──────────────────────────────────────────────┤                    │
│ Store token              │                      │                    │
│                         │                      │                    │
├─ View Products Mgmt     │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /admin/products │                    │
│                         │ (Protected Route)    │                    │
│                         ├─ Check: role=admin? │                    │
│                         │ ✓ admin role        │                    │
│                         ├─ GET /products      │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check: role=a...│
│                         │                      │ ✓ ADMIN ONLY      │
│                         │<─────────────────────┤ Return products   │
│<──────────────────────────────────────────────┤                    │
│ Show product list        │                      │                    │
│                         │                      │                    │
├─ Try to view            │                      │                    │
│   Transactions           │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /transactions   │                    │
│                         ├─ Token in header     │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check: role=a...│
│                         │                      │ ✗ KASIR ONLY     │
│                         │                      │ if (admin) {     │
│                         │                      │   BLOCK with 403 │
│                         │                      │ }                │
│                         │<─────────────────────┤ 403 Forbidden    │
│                         │ Admin tidak memiliki │                    │
│                         │ akses ke transaksi   │                    │
│<──────────────────────────────────────────────┤                    │
│ Error shown              │                      │                    │
```

### KASIR Flow - Managing Transactions
```
Kasir                     Frontend               Middleware           Backend
│                         │                      │                    │
├─ Login as Kasir         │                      │                    │
├─────────────────────────>│                      │                    │
│ (No frontend UI for     ├─ POST /auth/login    │                    │
│  kasir, use API client) ├─────────────────────>│                    │
│                         │                      ├─ Return JWT Token  │
│                         │                      │ role: "kasir"      │
│<──────────────────────────────────────────────┤                    │
│                         │                      │                    │
├─ Create Transaction     │                      │                    │
├─ (via API client)       │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ POST /transactions  │                    │
│                         ├─ Token in header     │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check: role=k...│
│                         │                      │ ✓ KASIR ONLY      │
│                         │                      │                    │
│                         │<─────────────────────┤ Transaction       │
│                         │ 201 Created          │ created           │
│<──────────────────────────────────────────────┤                    │
│ Transaction created      │                      │                    │
│                         │                      │                    │
├─ View All Transactions  │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ GET /transactions   │                    │
│                         ├─ Token in header     │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check: role=k...│
│                         │                      │ ✓ KASIR           │
│                         │                      │ ✓ Return ALL      │
│                         │                      │                    │
│                         │<─────────────────────┤ All transactions  │
│<──────────────────────────────────────────────┤                    │
│ Show all transaksi       │                      │                    │
│                         │                      │                    │
├─ Update Transaction     │                      │                    │
├─────────────────────────>│                      │                    │
│                         ├─ PUT /transactions/1 │                    │
│                         ├─────────────────────>│                    │
│                         │                      ├─ Verify Token     │
│                         │                      ├─ Check: role=k...│
│                         │                      │ ✓ KASIR ONLY      │
│                         │<─────────────────────┤ Updated           │
│<──────────────────────────────────────────────┤                    │
│ Transaction updated      │                      │                    │
```

---

## Authorization Decision Tree

```
                    ┌─── REQUEST ───┐
                    │               │
                    v               v
           ┌──────────────┐  ┌─────────────┐
           │ Public Route │  │ Token Needed│
           │ (no auth)    │  │   (auth)    │
           └────┬─────────┘  └──────┬──────┘
                │                   │
                │                   v
                │            ┌──────────────────┐
                │            │ Verify Token     │
                │            │ Valid?           │
                │            └──┬──────────┬────┘
                │               │          │
                │        YES    │          │ NO
                │               │          │
                │               v          v
                │        ┌──────────────────────┐
                │        │ return 401           │
        ┌───────┤        │ "Token tidak         │
        │       │        │  ditemukan"          │
        │       │        └──────────────────────┘
        │       │
        │       v
        │   ┌────────────────┐
        │   │ Check Role     │
        │   │ (if needed)    │
        │   └──┬──────────┬──┘
        │      │ ✓MATCH   │ ✗NO
        │      │          │
        │      v          v
        │   SUCCESS    ┌──────────────────────┐
        │             │ return 403           │
        │             │ "Akses ditolak"      │
        │             └──────────────────────┘
        │
        └──────────────────────────────────────>
                      │
                      v
              ┌──────────────┐
              │ Process   │
              │ Request   │
              │           │
              └─────┬─────┘
                    │
                    v
           ┌──────────────────┐
           │ Return Response  │
           │ (200, 201, etc)  │
           └──────────────────┘
```

---

## Role Hierarchy & Permissions

```
                        ┌─────────────┐
                        │  UNIVERSAL  │
                        │  - Browse   │
                        │  - Browse   │
                        │  Categories │
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              v                v                v
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │  USER    │    │  KASIR   │    │  ADMIN   │
        ├──────────┤    ├──────────┤    ├──────────┤
        │ - Own    │    │ - All    │    │ - All    │
        │   Txn    │    │   Txn    │    │   Users  │
        │ - Order  │    │ - Manage │    │ - Create │
        │   (POST) │    │   Txn    │    │   Prod   │
        │          │    │ (CRUD)   │    │ - Manage │
        │          │    │          │    │   Cat    │
        │          │    │          │    │ - Manage │
        │          │    │          │    │   Users  │
        │          │    │          │    │          │
        │ BLOCKED: │    │ BLOCKED: │    │ BLOCKED: │
        │ - Prod   │    │ - Prod   │    │ - Txn    │
        │ - Cat    │    │ - Cat    │    │ (ALL)    │
        │ - Users  │    │ - Users  │    │          │
        └──────────┘    └──────────┘    └──────────┘
```

---

## Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 1,
    "username": "john",
    "role": "user",
    "iat": 1677000000,
    "exp": 1677086400
  },
  "signature": "HMACSHA256(...)"
}
```

---

## Database Schema (Simplified)

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  password VARCHAR (hashed),
  role ENUM('user', 'kasir', 'admin'),
  created_at TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  author VARCHAR,
  category_name VARCHAR,
  price DECIMAL,
  image VARCHAR,
  created_at TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR,
  description TEXT,
  created_at TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER (FK: users),
  transaction_code VARCHAR UNIQUE,
  total_amount DECIMAL,
  status ENUM('pending','paid','shipped','delivered','cancelled'),
  payment_method VARCHAR,
  shipping_address TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

**Diagram Created**: March 9, 2026
