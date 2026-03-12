import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { clearAuthStorage, getUserFromStorage } from "../utils/authCleanup";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
    
    // Listen for login event dari Login.jsx
    const handleUserLogin = () => {
      const updatedUserJson = localStorage.getItem("user");
      if (updatedUserJson) {
        setUser(JSON.parse(updatedUserJson));
      }
    };
    
    window.addEventListener('userLoginSuccess', handleUserLogin);
    
    return () => {
      window.removeEventListener('userLoginSuccess', handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    // Clear semua auth data
    clearAuthStorage();
    
    // Reset state
    setUser(null);
    
    // Redirect ke login
    navigate("/");
  };

  if (!user) return null;

  // Jangan tampilkan navbar di halaman login/register
  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          📚 Toko Buku
        </Link>

        <div className="navbar-menu">
          <div className="nav-left">
            {/* Menu untuk semua user */}
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            {/* Menu ADMIN */}
            {user.role === "admin" && (
              <>
                <Link to="/admin/products" className="nav-link">
                  📦 Produk
                </Link>
                <Link to="/admin/categories" className="nav-link">
                  🏷️ Kategori
                </Link>
                <Link to="/admin/users" className="nav-link">
                  👥 Users
                </Link>
                <Link to="/admin/transactions" className="nav-link">
                  📋 Transaksi
                </Link>
              </>
            )}

            {/* Menu KASIR */}
            {user.role === "kasir" && (
              <>
                <Link to="/kasir/transactions" className="nav-link">
                  💳 Transaksi
                </Link>
              </>
            )}

            {/* Menu USER */}
            {user.role === "user" && (
              <>
                <Link to="/customer/transactions" className="nav-link">
                  📋 Transaksi Saya
                </Link>
              </>
            )}
          </div>

          <div className="nav-right">
            <span className="user-info">
              👤 {user.username} ({user.role})
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="navbar-mobile">
          <Link to="/dashboard" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
            Dashboard
          </Link>
          {user.role === "admin" && (
            <>
              <Link to="/admin/products" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
                📦 Produk
              </Link>
              <Link to="/admin/categories" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
                🏷️ Kategori
              </Link>
              <Link to="/admin/users" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
                👥 Users
              </Link>
              <Link to="/admin/transactions" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
                📋 Transaksi
              </Link>
            </>
          )}
          {user.role === "kasir" && (
            <Link to="/kasir/transactions" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
              💳 Transaksi
            </Link>
          )}
          {user.role === "user" && (
            <Link to="/customer/transactions" className="nav-link-mobile" onClick={() => setShowMenu(false)}>
              📋 Transaksi Saya
            </Link>
          )}
          <button className="logout-btn-mobile" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
