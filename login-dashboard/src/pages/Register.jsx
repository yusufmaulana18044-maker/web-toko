import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.full_name || !formData.password) {
      setError("Username, email, nama lengkap, dan password harus diisi!");
      return false;
    }

    if (formData.username.length < 3) {
      setError("Username minimal 3 karakter!");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email tidak valid!");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("✅ Registrasi berhasil! Silahkan login.");
        navigate("/");
      } else {
        setError(data.message || "Registrasi gagal!");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Gagal koneksi ke server. Pastikan backend berjalan di localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo">📚</div>
            <h1>Toko Buku Digital</h1>
            <p>Daftar Akun Baru</p>
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">👤 Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Minimal 3 karakter"
                  value={formData.username}
                  onChange={handleChange}
                  className={error ? "input-error" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">📧 Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email aktif Anda"
                  value={formData.email}
                  onChange={handleChange}
                  className={error ? "input-error" : ""}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="full_name">👨‍👩‍👧 Nama Lengkap</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.full_name}
                onChange={handleChange}
                className={error ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">☎️ No. Telepon (Opsional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Nomor telepon Anda"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">🔒 Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="form-group">
                <label htmlFor="confirmPassword">🔒 Konfirmasi Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={error ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? "⏳ Loading..." : "✨ Daftar Sekarang"}
            </button>
          </form>

          <div className="register-footer">
            <p>Sudah punya akun? <Link to="/" className="login-link">Masuk di sini</Link></p>
          </div>
        </div>

        <div className="register-info">
          <div className="info-card">
            <span className="icon">🔒</span>
            <h3>Aman & Terpercaya</h3>
            <p>Data Anda terlindungi</p>
          </div>
          <div className="info-card">
            <span className="icon">🎁</span>
            <h3>Bonus Member</h3>
            <p>Dapatkan diskon spesial</p>
          </div>
          <div className="info-card">
            <span className="icon">📚</span>
            <h3>Koleksi Lengkap</h3>
            <p>Akses ribuan buku pilihan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
