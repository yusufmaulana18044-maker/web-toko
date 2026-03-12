import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearAuthStorage, setUserToStorage, setTokenToStorage } from "../utils/authCleanup";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Username dan password harus diisi!");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Clear semua data auth lama
        clearAuthStorage();
        
        // Set token dan user baru
        setTokenToStorage(data.token);
        setUserToStorage(data.user);
        
        // Dispatch event agar Navbar ter-update
        window.dispatchEvent(new Event('userLoginSuccess'));
        
        navigate("/dashboard");
      } else {
        setError(data.message || "Login gagal!");
        setPassword("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Gagal koneksi ke server. Pastikan backend berjalan di localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">📚</div>
            <h1>Toko Buku Digital</h1>
            <p>Selamat datang kembali</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">👤 Username</label>
              <input
                type="text"
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={error ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">🔒 Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={error ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "⏳ Loading..." : "✨ Masuk Sekarang"}
            </button>
          </form>

          <div className="login-footer">
            <p>Belum punya akun? <Link to="/register" className="register-link">Daftar di sini</Link></p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <span className="icon">📖</span>
            <h3>Koleksi Lengkap</h3>
            <p>Ribuan buku berkualitas</p>
          </div>
          <div className="info-card">
            <span className="icon">💻</span>
            <h3>Akses Digital</h3>
            <p>Baca di mana saja, kapan saja</p>
          </div>
          <div className="info-card">
            <span className="icon">🎓</span>
            <h3>Belajar Mudah</h3>
            <p>Tingkatkan pengetahuan Anda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
