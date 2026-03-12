# 📚 Web Toko - Frontend Documentation

## Overview
Frontend aplikasi Web Toko Buku Digital telah selesai diimplementasikan menggunakan React dengan routing menggunakan React Router DOM v6.

## 📁 Struktur Folder

```
login-dashboard/
├── public/
│   ├── index.html
│   └── images/
├── src/
│   ├── App.jsx                   # Main router dan wrapper
│   ├── index.css                 # Global styles
│   ├── index.js                  # Entry point
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation bar (all pages)
│   │   ├── Navbar.css
│   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   └── pages/
│       ├── Login.jsx             # Login page
│       ├── Login.css
│       ├── Register.jsx          # User registration
│       ├── Register.css
│       ├── Dashboard.jsx         # Main shop/catalog (user)
│       ├── Dashboard.css
│       ├── Receipt.jsx           # Transaction receipt
│       ├── Receipt.css
│       ├── AdminProducts.jsx     # Product management (admin)
│       ├── AdminProducts.css
│       ├── AdminCategories.jsx   # Category management (admin)
│       ├── AdminCategories.css
│       ├── AdminUsers.jsx        # User management (admin)
│       └── AdminUsers.css
└── package.json
```

## 🔐 Authentication Flow

1. **Login** (`/`)
   - Username & password authentication
   - Stores JWT token in localStorage
   - Redirects to Dashboard on success

2. **Register** (`/register`)
   - Create new user account
   - Form validation
   - Redirects to Login after registration

3. **Protected Routes**
   - All protected routes check for valid token
   - Role-based access control via ProtectedRoute component
   - Unauthorized redirects to login

## 📄 Pages & Routes

### Public Routes
- **`/`** - Login page
- **`/register`** - Registration page

### Protected Routes (User & Admin)
- **`/dashboard`** - Main shop/catalog
  - Browse books by category
  - Search functionality
  - Shopping cart management
  - Checkout & receipt generation

### Protected Routes (Admin Only)
- **`/admin/products`** - Product management
  - Create, Read, Update, Delete products
  - Product table with all details
  
- **`/admin/categories`** - Category management
  - Create, Read, Update, Delete categories
  - Auto-slug generation from category name
  
- **`/admin/users`** - User management
  - View all users
  - Update user roles (user, kasir, admin)
  - Delete users

## 🎨 Components

### Navbar (Navbar.jsx)
- Navigation links based on user role
- User info display
- Logout functionality
- Mobile-responsive menu toggle
- Hidden on login/register pages

### ProtectedRoute (ProtectedRoute.jsx)
- Wrapper component for route protection
- Checks for token existence
- Validates user role if required
- Redirects to login if unauthorized

### Dashboard (Dashboard.jsx)
- Product catalog display
- Category filtering
- Search functionality
- Shopping cart with quantity management
- Checkout process
- Order receipt generation

## 🔧 Key Features

### User Dashboard
✅ Browse book catalog
✅ Filter by category
✅ Search books
✅ Add to cart
✅ Manage cart quantities
✅ Checkout process
✅ View receipt
✅ Logout

### Admin Panel
✅ Product management (CRUD)
✅ Category management (CRUD)
✅ User management
✅ Role assignment
✅ User deletion

## 🎯 API Endpoints Used

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/users/` - Get all users (admin)
- `PATCH /auth/update-role` - Update user role
- `DELETE /auth/users/{id}` - Delete user

### Products
- `GET /products` - Get all products
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### Transactions
- `POST /api/orders` - Create order

## 🚀 Getting Started

### Installation
```bash
cd login-dashboard
npm install
```

### Development Server
```bash
npm start
# or
npm run dev
```

The app will run on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "react-scripts": "^5.0.1"
}
```

## 🎨 Styling

- CSS modules for each component/page
- Responsive design (mobile-first approach)
- Color scheme:
  - Primary: `#3498db` (Blue)
  - Success: `#27ae60` (Green)
  - Error: `#e74c3c` (Red)
  - Warning: `#f39c12` (Orange)
  - Dark: `#2c3e50` (Dark Gray)

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with role-based access control
- Token stored in localStorage
- Logout clears authentication data
- Admin panel requires admin role

## 📋 State Management

Using React Hooks:
- `useState` - Component state
- `useEffect` - Side effects (API calls, data fetching)
- `useNavigate` - Navigation
- `useLocation` - Current location/route

## 🐛 Error Handling

- Network error messages for API failures
- Form validation with error display
- User-friendly error alerts
- Fallback UI for loading states
- Confirmation dialogs for destructive actions

## ✨ Features Completed

- [x] Login & Registration system
- [x] Dashboard with product catalog
- [x] Shopping cart functionality
- [x] Product management (admin)
- [x] Category management (admin)
- [x] User management (admin)
- [x] Role-based access control
- [x] Receipt generation
- [x] Navbar with role-based menu
- [x] Protected routes
- [x] Responsive design
- [x] Mobile-friendly UI

## 🚀 Next Steps (Optional Enhancements)

- [ ] Product image upload
- [ ] Advanced search filters
- [ ] User profile page
- [ ] Transaction history
- [ ] Payment integration
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Product reviews & ratings

---

**Frontend Status**: ✅ **COMPLETE**

Last Updated: March 9, 2026
