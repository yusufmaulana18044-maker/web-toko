const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db/db");
const { verifyToken, checkRole } = require("../middleware/auth");

const SECRET_KEY = "rahasia_jwt";

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

    // Cek username sudah ada
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username sudah terdaftar"
      });
    }

    // Cek email sudah ada
    const emailExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    console.log("📝 Attempting to insert user:", { username, email, full_name, phone });
    console.log("Query parameters:", [username, email, full_name, phone || "", hashedPassword, "user"]);
    
    const result = await pool.query(
      "INSERT INTO users (username, email, full_name, phone, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, username, email, full_name, role",
      [username, email, full_name, phone || "", hashedPassword, "user"]
    );

    console.log("✅ User inserted successfully:", result.rows[0]);
    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silahkan login.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("❌ ERROR REGISTER:", err.message);
    console.error("Error details:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
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

    // Query user dari database
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const user = result.rows[0];
    
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

// UPDATE ROLE: upgrade user ke admin, kasir, atau role lain
router.patch("/update-role", async (req, res) => {
  try {
    const { username, new_role } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    // Validasi token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan"
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    // Hanya admin yang bisa update role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Hanya admin yang bisa mengubah role"
      });
    }

    // Validasi input
    if (!username || !new_role) {
      return res.status(400).json({
        success: false,
        message: "Username dan new_role wajib diisi"
      });
    }

    // Validasi role yang diizinkan
    const validRoles = ["user", "admin", "kasir"];
    if (!validRoles.includes(new_role)) {
      return res.status(400).json({
        success: false,
        message: `Role harus salah satu dari: ${validRoles.join(", ")}`
      });
    }

    // Update role di database
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE username = $2 RETURNING id, username, role",
      [new_role, username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const updatedUser = result.rows[0];

    res.json({
      success: true,
      message: `Role user ${username} berhasil diubah menjadi ${new_role}`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error("❌ ERROR UPDATE ROLE:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

// ========== USER MANAGEMENT (ADMIN ONLY) ==========

// GET semua users (HANYA ADMIN)
router.get("/users/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, full_name, phone, role, created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("❌ ERROR GET USERS:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

// GET single user by ID (HANYA ADMIN)
router.get("/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("❌ ERROR GET USER:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

// DELETE user (HANYA ADMIN)
router.delete("/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Anda tidak bisa menghapus akun sendiri"
      });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, username",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: `User ${result.rows[0].username} berhasil dihapus`
    });
  } catch (err) {
    console.error("❌ ERROR DELETE USER:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

module.exports = router;
