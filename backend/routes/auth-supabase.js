/**
 * Authentication Routes dengan Supabase
 * Menggunakan JWT untuk session management
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../db/supabase");
const { verifyToken, checkRole } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_jwt";

// ============ PUBLIC ENDPOINTS ============

/**
 * POST /auth/login
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi"
      });
    }

    // Get user from Supabase
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, password, role, is_approved")
      .eq("username", username)
      .single();

    if (error || !users) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah"
      });
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, users.password);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah"
      });
    }

    // Check approval status
    if (!users.is_approved && users.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Akun Anda belum disetujui. Hubungi kasir."
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: users.id,
        username: users.username,
        role: users.role,
        email: users.email
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
        full_name: users.full_name,
        role: users.role,
        is_approved: users.is_approved
      }
    });
  } catch (err) {
    console.error("❌ ERROR LOGIN:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * POST /auth/register
 * Register user baru
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, full_name, phone, password, password_confirm } = req.body;

    // Validasi input
    if (!username || !email || !full_name || !password || !password_confirm) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi"
      });
    }

    // Check password match
    if (password !== password_confirm) {
      return res.status(400).json({
        success: false,
        message: "Password tidak cocok"
      });
    }

    // Check username exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username sudah terdaftar"
      });
    }

    // Check email exists
    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          full_name,
          phone: phone || "",
          password: hashedPassword,
          role: "user",
          is_approved: false,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (insertError) {
      console.error("❌ Error creating user:", insertError);
      return res.status(500).json({
        success: false,
        message: "Gagal membuat akun"
      });
    }

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Menunggu approval dari kasir untuk bisa melakukan transaksi.",
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        full_name: newUser[0].full_name,
        role: newUser[0].role,
        is_approved: newUser[0].is_approved
      }
    });
  } catch (err) {
    console.error("❌ ERROR REGISTER:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * POST /auth/logout
 * Logout (tipis - mostly client-side)
 */
router.post("/logout", verifyToken, async (req, res) => {
  res.json({
    success: true,
    message: "Logout berhasil"
  });
});

// ============ ADMIN ENDPOINTS ============

/**
 * GET /auth/users/
 * Mendapatkan semua users (ADMIN ONLY)
 */
router.get("/users/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, phone, role, is_approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data users"
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * GET /auth/users/:id
 * Mendapatkan detail user (ADMIN ONLY)
 */
router.get("/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    // Remove password from response
    delete data.password;

    res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * PATCH /auth/update-role
 * Update user role (ADMIN ONLY)
 */
router.patch("/update-role", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { user_id, role } = req.body;

    if (!user_id || !role) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: user_id, role"
      });
    }

    if (!["user", "kasir", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid. Pilih: user, kasir, atau admin"
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role, is_approved: role !== "user" })
      .eq("id", parseInt(user_id))
      .select();

    if (error) {
      console.error("❌ Error updating role:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal update role"
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: `Role user berhasil diubah menjadi ${role}`,
      data: data[0]
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * DELETE /auth/users/:id
 * Hapus user (ADMIN ONLY)
 */
router.delete("/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus transaksi user terlebih dahulu (cascade)
    await supabase
      .from("transactions")
      .delete()
      .eq("user_id", parseInt(id));

    // Hapus user
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      console.error("❌ Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal hapus user"
      });
    }

    res.json({
      success: true,
      message: "User berhasil dihapus"
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
