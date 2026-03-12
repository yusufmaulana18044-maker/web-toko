const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET semua transactions (kasir lihat semua, user lihat milik sendiri)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Admin tidak boleh akses transaksi
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin tidak memiliki akses ke transaksi management"
      });
    }

    let query = "SELECT * FROM transactions ORDER BY created_at DESC";
    let params = [];

    // Filter berdasarkan role
    if (req.user.role === "user") {
      query = "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC";
      params = [req.user.id];
    }
    // Kasir bisa lihat semua transaksi

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// GET transaction by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan"
      });
    }

    const transaction = result.rows[0];

    // Validasi akses: user hanya lihat miliknya, kasir bisa lihat semua
    if (req.user.role === "user" && transaction.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Anda hanya bisa melihat transaksi milik sendiri"
      });
    }

    // Admin tidak boleh akses
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin tidak memiliki akses ke transaksi management"
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// POST create new transaction by kasir
router.post("/", verifyToken, checkRole("kasir"), async (req, res) => {
  try {
    const { user_id, items, total_amount, payment_method, shipping_address, notes } = req.body;

    if (!user_id || !items || items.length === 0 || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "user_id, items, dan total_amount wajib diisi"
      });
    }

    // Generate transaction code
    const timestamp = Date.now();
    const transaction_code = `TRX-${timestamp}-${req.user.id}`;

    const result = await pool.query(
      `INSERT INTO transactions 
       (user_id, transaction_code, items, total_amount, status, payment_method, shipping_address, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        user_id,
        transaction_code,
        JSON.stringify(items),
        total_amount,
        'completed',
        payment_method || 'cash',
        shipping_address || '',
        notes || ''
      ]
    );

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// PUT update transaction status by kasir
router.put("/:id", verifyToken, checkRole("kasir"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method, notes } = req.body;

    const validStatus = ["pending", "paid", "shipped", "delivered", "cancelled", "completed"];
    
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatus.join(", ")}`
      });
    }

    // Cek transaksi exists
    const checkResult = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan"
      });
    }

    const currentTransaction = checkResult.rows[0];
    
    const result = await pool.query(
      `UPDATE transactions 
       SET status = COALESCE($1, status),
           payment_method = COALESCE($2, payment_method),
           notes = COALESCE($3, notes),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [status || null, payment_method || null, notes || null, id]
    );

    res.json({
      success: true,
      message: "Transaksi berhasil diupdate",
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
