# 🧪 Authorization Test Scenarios

## Test Setup

### Backend Running
```bash
cd backend
npm start
# Server on http://localhost:5000
```

### Frontend Running
```bash
cd login-dashboard
npm start
# App on http://localhost:3000
```

---

## Test Case 1: USER (Customer) Testing

### 1.1 Customer Dapat Lihat Products
```
✅ GET /products
Response: List of 10 books
Status: 200 OK
```

### 1.2 Customer Dapat Lihat Categories
```
✅ GET /categories
Response: List of 8 categories
Status: 200 OK
```

### 1.3 Customer Checkout
```
✅ POST /api/orders
Header: No token needed (public)
Body: { items: [...], total: 150000 }
Response: Order created with order ID
Status: 201 Created
```

### 1.4 Customer Lihat Transaksi Sendiri
```
✅ GET /transactions
Header: Authorization: Bearer <user-token>
Response: Only transaksi with user_id = current user
Status: 200 OK
```

### 1.5 Customer TIDAK Bisa Lihat Transaksi Orang Lain
```
❌ GET /transactions/2 (if user_id != 2)
Header: Authorization: Bearer <user-token>
Response: "Anda hanya bisa melihat transaksi milik sendiri"
Status: 403 Forbidden
```

### 1.6 Customer TIDAK Bisa Create/Edit/Delete Products
```
❌ POST /products
❌ PUT /products/1
❌ DELETE /products/1
Response: "Akses ditolak. Role yang diizinkan: admin"
Status: 403 Forbidden
```

### 1.7 Customer TIDAK Bisa Manage Transaksi
```
❌ POST /transactions
❌ PUT /transactions/1
❌ DELETE /transactions/1
Response: "Akses ditolak. Role yang diizinkan: kasir"
Status: 403 Forbidden
```

### 1.8 Customer TIDAK Bisa Lihat/Manage Users
```
❌ GET /auth/users
❌ DELETE /auth/users/1
Response: "Akses ditolak. Role yang diizinkan: admin"
Status: 403 Forbidden
```

---

## Test Case 2: KASIR (Cashier) Testing

### 2.1 Kasir Lihat ALL Transactions
```
✅ GET /transactions
Header: Authorization: Bearer <kasir-token>
Response: ALL transactions (user_id = any)
Status: 200 OK
```

### 2.2 Kasir Create Transaction
```
✅ POST /transactions
Header: Authorization: Bearer <kasir-token>
Body: {
  "user_id": 2,
  "items": [{ product_id: 1, quantity: 2, subtotal: 150000 }],
  "shipping_address": "Jl. Merdeka 123"
}
Response: New transaction created
Status: 201 Created
```

### 2.3 Kasir Update Transaction Status
```
✅ PUT /transactions/1
Header: Authorization: Bearer <kasir-token>
Body: { "status": "paid", "payment_method": "cash" }
Response: Transaction updated
Status: 200 OK
```

### 2.4 Kasir Cancel Transaction
```
✅ DELETE /transactions/1
Header: Authorization: Bearer <kasir-token>
Response: Transaction cancelled
Status: 200 OK
```

### 2.5 Kasir TIDAK Bisa Manage Products
```
❌ POST /products
❌ PUT /products/1
❌ DELETE /products/1
Response: "Akses ditolak. Role yang diizinkan: admin"
Status: 403 Forbidden
```

### 2.6 Kasir TIDAK Bisa Manage Users
```
❌ GET /auth/users
❌ DELETE /auth/users/1
Response: "Akses ditolak. Role yang diizinkan: admin"
Status: 403 Forbidden
```

---

## Test Case 3: ADMIN Testing

### 3.1 Admin Create Product
```
✅ POST /products
Header: Authorization: Bearer <admin-token>
Body: {
  "title": "New Book",
  "author": "Author Name",
  "category_name": "Cerita Rakyat",
  "price": 75000
}
Response: Product created
Status: 201 Created
```

### 3.2 Admin Update Product
```
✅ PUT /products/1
Header: Authorization: Bearer <admin-token>
Body: {
  "title": "Updated Title",
  "author": "Updated Author",
  "category_name": "Fabel",
  "price": 80000
}
Response: Product updated
Status: 200 OK
```

### 3.3 Admin Delete Product
```
✅ DELETE /products/1
Header: Authorization: Bearer <admin-token>
Response: Product deleted
Status: 200 OK
```

### 3.4 Admin Create Category
```
✅ POST /categories
Header: Authorization: Bearer <admin-token>
Body: {
  "name": "Horor",
  "slug": "horor",
  "description": "Cerita horor untuk anak"
}
Response: Category created
Status: 201 Created
```

### 3.5 Admin Update Category
```
✅ PUT /categories/1
Header: Authorization: Bearer <admin-token>
Body: { ... }
Response: Category updated
Status: 200 OK
```

### 3.6 Admin Delete Category
```
✅ DELETE /categories/1
Header: Authorization: Bearer <admin-token>
Response: Category deleted
Status: 200 OK
```

### 3.7 Admin View All Users
```
✅ GET /auth/users
Header: Authorization: Bearer <admin-token>
Response: [
  { id: 1, username: "user1", role: "user" },
  { id: 2, username: "kasir1", role: "kasir" },
  { id: 3, username: "admin1", role: "admin" }
]
Status: 200 OK
```

### 3.8 Admin Update User Role
```
✅ PATCH /auth/update-role
Header: Authorization: Bearer <admin-token>
Body: { "username": "user1", "new_role": "kasir" }
Response: Role updated to kasir
Status: 200 OK
```

### 3.9 Admin Delete User
```
✅ DELETE /auth/users/1
Header: Authorization: Bearer <admin-token>
Response: User deleted
Status: 200 OK
```

### 3.10 Admin TIDAK Bisa Access Transactions
```
❌ GET /transactions
❌ POST /transactions
❌ PUT /transactions/1
❌ DELETE /transactions/1
Header: Authorization: Bearer <admin-token>
Response: "Admin tidak memiliki akses ke transaksi management"
Status: 403 Forbidden
```

---

## Test Case 4: Without Token

### 4.1 Access Protected Endpoint Without Token
```
❌ GET /transactions
❌ GET /auth/users
Response: "Token tidak ditemukan"
Status: 401 Unauthorized
```

### 4.2 Invalid Token
```
❌ GET /auth/users
Header: Authorization: Bearer invalid-token
Response: "Token tidak valid"
Status: 401 Unauthorized
```

### 4.3 Expired Token
```
❌ GET /auth/users
Header: Authorization: Bearer expired-token
Response: "Token sudah expired"
Status: 401 Unauthorized
```

---

## Test Case 5: Frontend Navigation

### 5.1 Customer Dashboard
```
✅ /dashboard - Lihat products & categories
✅ /receipt - Lihat struk setelah checkout
❌ /admin/products - Redirect ke login
❌ /admin/categories - Redirect ke login
❌ /admin/users - Redirect ke login
```

### 5.2 Kasir Dashboard
```
Navigation tidak ada di frontend untuk kasir
(Kasir hanya perlu API access via Postman/curl)
```

### 5.3 Admin Dashboard
```
✅ /admin/products - Manage products
✅ /admin/categories - Manage categories
✅ /admin/users - Manage users
❌ /receipt - Can't access (not admin feature)
```

---

## Quick Test with cURL

### Login as User
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'
```

### Get User Transactions
```bash
TOKEN="<from-login>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/transactions
```

### Try to Access Admin Endpoint (Should Fail)
```bash
TOKEN="<user-token>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/auth/users
# Response: Akses ditolak. Role yang diizinkan: admin
```

### Login as Admin
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Users (Admin)
```bash
TOKEN="<admin-token>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/auth/users
# Response: List of all users
```

### Try to Access Transactions (Admin Should Fail)
```bash
TOKEN="<admin-token>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/transactions
# Response: Admin tidak memiliki akses ke transaksi management
```

---

## Expected Results Summary

| Test | USER | KASIR | ADMIN | Result |
|------|------|-------|-------|--------|
| View Products | ✅ | ✅ | ✅ | PASS |
| Create Product | ❌ | ❌ | ✅ | PASS |
| Manage Categories | ❌ | ❌ | ✅ | PASS |
| View Own Transactions | ✅ | ❌ | ❌ | PASS |
| View All Transactions | ❌ | ✅ | ❌ | PASS |
| Create Transaction | ❌ | ✅ | ❌ | PASS |
| Manage Users | ❌ | ❌ | ✅ | PASS |
| Deny Transaction Access to Admin | ❌ | ❌ | ✅(denied) | PASS |

---

## Manual Testing Checklist

- [ ] User dapat login
- [ ] User melihat dashboard & products
- [ ] User dapat checkout
- [ ] User melihat transaksi diri sendiri
- [ ] User TIDAK bisa akses admin panel
- [ ] Admin dapat login
- [ ] Admin manage products (CRUD)
- [ ] Admin manage categories (CRUD)
- [ ] Admin manage users (view, delete, update role)
- [ ] Admin TIDAK bisa akses transactions
- [ ] Kasir dapat login (via Postman/curl)
- [ ] Kasir manage transactions (CRUD)
- [ ] Kasir TIDAK bisa manage products/categories/users
- [ ] Without token, protected endpoints return 401
- [ ] With invalid role, endpoints return 403

---

**Testing Status**: 🟢 **Ready for QA**

Last Updated: March 9, 2026
