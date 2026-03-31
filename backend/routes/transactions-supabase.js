/**
 * Transactions Routes dengan Supabase
 * - USER: dapat melihat transaksi mereka sendiri
 * - KASIR: dapat melihat semua transaksi dan membuat transaksi baru
 * - ADMIN: full access
 */

const express = require("express");
const router = express.Router();
const { supabase } = require("../db/supabase");
const { verifyToken, checkRole } = require("../middleware/auth");

// ============ PROTECTED ENDPOINTS ============

/**
 * GET /transactions
 * Mendapatkan daftar transaksi (filtered by role)
 * - USER: hanya transaksi milik sendiri
 * - KASIR: semua transaksi
 * - ADMIN: semua transaksi
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = supabase
      .from("transactions")
      .select("id, user_id, transaction_code, items, total_amount, status, payment_method, created_at");

    // Filter by role
    if (userRole === "user") {
      // User hanya bisa lihat transaksi sendiri
      query = query.eq("user_id", userId);
    }
    // KASIR dan ADMIN bisa lihat semua transaksi

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching transactions:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data transaksi"
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
 * GET /transactions/:id
 * Mendapatkan detail transaksi
 * - USER: hanya transaksi milik sendiri
 * - KASIR: semua transaksi
 * - ADMIN: semua transaksi
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("id", parseInt(id));

    const { data: transaction, error } = await query.single();

    if (error || !transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan"
      });
    }

    // Check authorization
    if (userRole === "user" && transaction.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke transaksi ini"
      });
    }

    res.json({
      success: true,
      data: transaction
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
 * POST /transactions
 * Membuat transaksi baru (KASIR & ADMIN ONLY)
 */
router.post("/", verifyToken, checkRole("kasir", "admin"), async (req, res) => {
  try {
    const { user_id, items, total_amount, status, payment_method } = req.body;

    if (!user_id || !items || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: user_id, items, total_amount"
      });
    }

    const transaction_code = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: parseInt(user_id),
          transaction_code,
          items: Array.isArray(items) ? items : JSON.parse(items),
          total_amount: parseInt(total_amount),
          status: status || "completed",
          payment_method: payment_method || "cash",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error creating transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal membuat transaksi"
      });
    }

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
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
 * PUT /transactions/:id
 * Update transaksi (KASIR & ADMIN ONLY)
 */
router.put("/:id", verifyToken, checkRole("kasir", "admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method, items, total_amount } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (payment_method) updateData.payment_method = payment_method;
    if (items) updateData.items = items;
    if (total_amount) updateData.total_amount = parseInt(total_amount);
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", parseInt(id))
      .select();

    if (error) {
      console.error("❌ Error updating transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal update transaksi"
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Transaksi berhasil diupdate",
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
 * DELETE /transactions/:id
 * Hapus transaksi (KASIR & ADMIN ONLY)
 */
router.delete("/:id", verifyToken, checkRole("kasir", "admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      console.error("❌ Error deleting transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal hapus transaksi"
      });
    }

    res.json({
      success: true,
      message: "Transaksi berhasil dihapus"
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
