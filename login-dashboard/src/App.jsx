import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Receipt from "./pages/Receipt";
import Transactions from "./pages/Transactions";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/receipt" element={
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        } />

        {/* Kasir Transactions Route */}
        <Route path="/kasir/transactions" element={
          <ProtectedRoute requiredRoles={["kasir"]}>
            <Transactions />
          </ProtectedRoute>
        } />

        {/* Customer Transactions Route */}
        <Route path="/customer/transactions" element={
          <ProtectedRoute requiredRoles={["user"]}>
            <Transactions />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/products" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
