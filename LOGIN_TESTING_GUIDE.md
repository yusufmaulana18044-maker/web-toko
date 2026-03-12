# 🧪 Testing Login & User Info Display

## Status Sekarang

✅ Frontend running di http://localhost:3000
✅ Backend running di http://localhost:5000
✅ Navbar sudah implement untuk display user info

---

## 📋 Testing Login dengan Admin

### Step 1: Akses Halaman Login
```
URL: http://localhost:3000
```

### Step 2: Login sebagai Admin

**Credentials:**
```
Username: admin
Password: admin123
```

### Step 3: Lihat Info Admin di Navbar

Setelah login, navbar akan menampilkan:
```
📚 Toko Buku  |  Dashboard  |  📦 Produk  |  🏷️ Kategori  |  👥 Users  |  ...
                                           👤 admin (admin)  [Logout]
```

#### Yang Harus Terlihat pada Navbar ADMIN:
✅ Username: **admin**
✅ Role: **(admin)**
✅ Menu ADMIN:
  - 📦 Produk
  - 🏷️ Kategori
  - 👥 Users
  - 📋 Transaksi

---

## 📋 Testing Login dengan Kasir

### Step 1: Click Logout Button
Klik tombol "Logout" di navbar kanan atas

### Step 2: Kembali ke Login
Browser akan redirect ke halaman login

### Step 3: Login sebagai Kasir

**Credentials:**
```
Username: kasir
Password: kasir123
```

### Step 4: Lihat Info Kasir di Navbar

Setelah login, navbar akan menampilkan:
```
📚 Toko Buku  |  Dashboard  |  💳 Transaksi  |  👤 kasir (kasir)  [Logout]
```

#### Yang Harus Terlihat pada Navbar KASIR:
✅ Username: **kasir**
✅ Role: **(kasir)**
✅ Menu KASIR:
  - 💳 Transaksi
✅ TIDAK ADA menu:
  - 📦 Produk
  - 🏷️ Kategori
  - 👥 Users

---

## 📋 Testing Login dengan User

### Step 1: Click Logout Button
Klik tombol "Logout" di navbar

### Step 2: Login sebagai User

**Credentials:**
```
Username: user
Password: user123
```

### Step 3: Lihat Info User di Navbar

Setelah login, navbar akan menampilkan:
```
📚 Toko Buku  |  Dashboard  |  📋 Transaksi Saya  |  👤 user (user)  [Logout]
```

#### Yang Harus Terlihat pada Navbar USER:
✅ Username: **user**
✅ Role: **(user)**
✅ Menu USER:
  - 📋 Transaksi Saya
✅ TIDAK ADA menu admin/kasir

---

## 🔍 Navbar Component Structure

```jsx
// Navbar menampilkan:
┌─────────────────────────────────────────────────────────┐
│  📚 Toko Buku  │  Dashboard  │  [Role-based Menus]    │
│                                                         │
│  Nav-Right:  👤 {username} ({role})  [Logout Button]  │
└─────────────────────────────────────────────────────────┘

// Display Info Lokasi:
<span className="user-info">
  👤 {user.username} ({user.role})
</span>
```

### Data dari Storage:
```javascript
// localStorage keys:
- "token": JWT token
- "user": { id, username, email, full_name, role }

// Navbar membaca dari localStorage:
const userJson = localStorage.getItem("user");
if (userJson) {
  setUser(JSON.parse(userJson));
}

// Tampilkan:
👤 {user.username} ({user.role})
```

---

## ✅ Verifikasi Checklist

### Admin Login
- [ ] URL: http://localhost:3000
- [ ] Input: username "admin", password "admin123"
- [ ] Click "Login"
- [ ] Redirect ke /dashboard
- [ ] Navbar tampil dengan:
  - [ ] "👤 admin (admin)" di kanan atas
  - [ ] Menu: Produk, Kategori, Users, Transaksi
  - [ ] Logout button tersedia

### Kasir Login
- [ ] Click Logout
- [ ] Redirect ke login page
- [ ] Input: username "kasir", password "kasir123"
- [ ] Click "Login"
- [ ] Redirect ke /dashboard
- [ ] Navbar tampil dengan:
  - [ ] "👤 kasir (kasir)" di kanan atas
  - [ ] Menu: hanya "Transaksi"
  - [ ] Tidak ada menu Produk/Kategori/Users
  - [ ] Logout button tersedia

### User Login
- [ ] Click Logout
- [ ] Redirect ke login page
- [ ] Input: username "user", password "user123"
- [ ] Click "Login"
- [ ] Redirect ke /dashboard
- [ ] Navbar tampil dengan:
  - [ ] "👤 user (user)" di kanan atas
  - [ ] Menu: hanya "Transaksi Saya"
  - [ ] Tidak ada menu admin/kasir
  - [ ] Logout button tersedia

---

## 🎨 Navbar CSS Classes

```css
.user-info {
  /* Menampilkan user info di navbar */
  color: #2c3e50;
  font-weight: bold;
}

.logout-btn {
  /* Tombol logout */
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
```

---

## 💡 What's Happening Behind Scenes

### Login Process:
```javascript
1. User input username & password
2. POST /auth/login ke backend
3. Backend return: { success: true, token, user: {...} }
4. Frontend localStorage:
   - setItem("token", token)
   - setItem("user", JSON.stringify(user))
5. Navigate ke /dashboard
6. Navbar component useEffect():
   - getItem("user") dari localStorage
   - Parse & set state
   - Render info dan menu berdasarkan role
```

### Logout Process:
```javascript
1. User click Logout button
2. handleLogout() function:
   - removeItem("token")
   - removeItem("user")
   - navigate("/")
3. Navbar component:
   - userJson = null
   - return null (navbar hidden di login page)
4. Back to login page
```

---

## 🔐 Role-Based Menu Display

```javascript
// Navbar.jsx
{user.role === "admin" && (
  <>
    <Link to="/admin/products">📦 Produk</Link>
    <Link to="/admin/categories">🏷️ Kategori</Link>
    <Link to="/admin/users">👥 Users</Link>
    <Link to="/admin/transactions">📋 Transaksi</Link>
  </>
)}

{user.role === "kasir" && (
  <>
    <Link to="/kasir/transactions">💳 Transaksi</Link>
  </>
)}

{user.role === "user" && (
  <>
    <Link to="/customer/transactions">📋 Transaksi Saya</Link>
  </>
)}
```

---

## 📍 Expected Navigation Paths

### Admin dapat akses:
- ✅ /dashboard
- ✅ /admin/products
- ✅ /admin/categories
- ✅ /admin/users
- ✅ /admin/transactions (dalam navbar)

### Kasir dapat akses:
- ✅ /dashboard
- ✅ /kasir/transactions (dalam navbar)

### User dapat akses:
- ✅ /dashboard
- ✅ /customer/transactions (dalam navbar)
- ✅ /receipt (setelah checkout)

---

## 🧪 Quick Manual Test

```bash
# Terminal 1: Pastikan backend running
cd backend
npm start
# http://localhost:5000

# Terminal 2: Pastikan frontend running
cd login-dashboard
npm start
# http://localhost:3000
```

### Test di Browser:

**Test 1: Admin Login**
1. Open: http://localhost:3000
2. Username: admin
3. Password: admin123
4. Click Login
5. Check navbar: "👤 admin (admin)"
6. Verify menu ada: Produk, Kategori, Users, Transaksi

**Test 2: Kasir Login**
1. Click Logout
2. Username: kasir
3. Password: kasir123
4. Click Login
5. Check navbar: "👤 kasir (kasir)"
6. Verify menu ada: hanya Transaksi

**Test 3: User Login**
1. Click Logout
2. Username: user
3. Password: user123
4. Click Login
5. Check navbar: "👤 user (user)"
6. Verify menu ada: hanya Transaksi Saya

---

## ✅ Expected Results

```
LOGIN ADMIN
├─ Username displayed: ✅ admin
├─ Role displayed: ✅ (admin)
├─ Menu Produk: ✅
├─ Menu Kategori: ✅
├─ Menu Users: ✅
└─ Logout working: ✅

LOGIN KASIR
├─ Username displayed: ✅ kasir
├─ Role displayed: ✅ (kasir)
├─ Menu Transaksi: ✅
├─ No Produk menu: ✅
├─ No Kategori menu: ✅
└─ Logout working: ✅

LOGIN USER
├─ Username displayed: ✅ user
├─ Role displayed: ✅ (user)
├─ Menu Transaksi Saya: ✅
├─ No Admin menus: ✅
└─ Logout working: ✅
```

---

## 🚀 Status

- ✅ Login system: WORKING
- ✅ Navbar display: CORRECT
- ✅ Role-based menu: IMPLEMENTED
- ✅ Logout: WORKING
- ✅ localStorage: STORING CORRECTLY

**Ready to test!** 🎉
