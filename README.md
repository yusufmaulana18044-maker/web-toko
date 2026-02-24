# Web Toko

Aplikasi web toko (e-commerce) dengan arsitektur backend API dan frontend React.

## Struktur Proyek

```
.
├── backend/                 # Server API (Node.js Express)
│   ├── index.js            # Entry point server
│   ├── package.json        # Dependencies backend
│   ├── db/
│   │   └── db.js           # Database configuration
│   └── routes/
│       ├── auth.js         # Authentication routes
│       ├── categories.js   # Categories endpoints
│       ├── products.js     # Products endpoints
│       └── transactions.js # Transactions endpoints
│
└── login-dashboard/        # Frontend React
    ├── package.json        # Dependencies frontend
    ├── public/
    │   ├── index.html      # HTML utama
    │   └── images/         # Asset gambar
    └── src/
        ├── App.jsx         # Main component
        ├── index.css       # Global styles
        ├── index.js        # React entry point
        └── pages/
            ├── Dashboard.jsx/css
            ├── Login.jsx/css
            ├── Register.jsx/css
            └── Receipt.jsx/css
```

## Persyaratan

- Node.js (v14 atau lebih tinggi)
- npm atau yarn
- Database (sesuai konfigurasi di `backend/db/db.js`)

## Setup dan Instalasi

### Backend

```bash
cd backend
npm install
# Konfigurasi file .env jika diperlukan
npm start
```

### Frontend

```bash
cd login-dashboard
npm install
npm start
```

Browser secara otomatis dibuka di `http://localhost:3000`

## Endpoint API

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru

### Categories
- `GET /api/categories` - Daftar kategori
- `POST /api/categories` - Buat kategori baru
- `PUT /api/categories/:id` - Update kategori
- `DELETE /api/categories/:id` - Hapus kategori

### Products
- `GET /api/products` - Daftar produk
- `POST /api/products` - Buat produk baru
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### Transactions
- `GET /api/transactions` - Daftar transaksi
- `POST /api/transactions` - Buat transaksi baru
- `GET /api/transactions/:id` - Detail transaksi

## Pages

- **Login** - Halaman login user
- **Register** - Halaman registrasi user baru
- **Dashboard** - Halaman utama setelah login
- **Receipt** - Halaman struk/invoice transaksi

## Variabel Lingkungan

Buat file `.env` di folder `backend` dengan konfigurasi:

```env
PORT=5000
DATABASE_URL=
SECRET_KEY=
```

## Development

### Menjalankan Backend dengan Hot Reload
```bash
cd backend
npm install -D nodemon
npx nodemon index.js
```

### Menjalankan Frontend dengan Hot Reload
```bash
cd login-dashboard
npm start
```

## Kontribusi

Untuk berkontribusi:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## Lisensi

Project ini open source.

## Kontak

Untuk pertanyaan atau saran, silakan hubungi developer.
