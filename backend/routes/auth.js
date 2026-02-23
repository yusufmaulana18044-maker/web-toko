const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "rahasia_jwt";

// Dummy users (tanpa database)
const users = {
  "admin": { id: 1, username: "admin", email: "admin@example.com", full_name: "Administrator", password: "admin123", role: "admin" },
  "user": { id: 2, username: "user", email: "user@example.com", full_name: "User Test", password: "user123", role: "user" }
};

// Token blacklist untuk logout
let tokenBlacklist = [];

// REGISTER: buat user baru
router.post("/register", async (req, res) => {
  const { username, email, full_name, phone, password } = req.body;

  try {
    if (!username || !email || !full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, nama lengkap, dan password wajib diisi"
      });
    }

    if (users[username]) {
      return res.status(400).json({
        success: false,
        message: "Username sudah terdaftar"
      });
    }

    // Cek email sudah ada
    const emailExists = Object.values(users).some(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user baru
    const newId = Math.max(...Object.values(users).map(u => u.id)) + 1;
    users[username] = {
      id: newId,
      username,
      email,
      full_name,
      phone: phone || "",
      role: "user",
      password: hashedPassword
    };

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silahkan login.",
      user: {
        id: users[username].id,
        username: users[username].username,
        email: users[username].email,
        full_name: users[username].full_name,
        role: users[username].role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// LOGIN: validasi password dengan yang disimpan
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi"
      });
    }

    if (!users[username]) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const user = users[username];
    
    // Validasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      tokenBlacklist.push(token);
    }

    res.json({
      success: true,
      message: "Logout berhasil"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// VERIFY TOKEN
router.post("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan"
      });
    }

    // Check blacklist
    if (tokenBlacklist.includes(token)) {
      return res.status(401).json({
        success: false,
        message: "Token sudah tidak valid (logout)"
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    res.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token sudah expired"
      });
    }
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Token tidak valid"
    });
  }
});

// GET current user info
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan"
      });
    }

    if (tokenBlacklist.includes(token)) {
      return res.status(401).json({
        success: false,
        message: "Token sudah tidak valid"
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    res.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
});

module.exports = router;
