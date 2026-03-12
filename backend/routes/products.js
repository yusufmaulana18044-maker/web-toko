const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET semua buku (PUBLIC - tidak perlu login)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Create produk (HANYA ADMIN)
router.post("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { title, author, category, price, image } = req.body;

    if (!title || !author || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, author, category, dan price wajib diisi"
      });
    }

    const result = await pool.query(
      "INSERT INTO products (title, author, category, price, image, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [title, author, category, parseInt(price), image]
    );

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
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

// PUT - Update produk (HANYA ADMIN)
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { title, author, category, price, image } = req.body;
    const { id } = req.params;

    if (!title || !author || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, author, category, dan price wajib diisi"
      });
    }

    const result = await pool.query(
      "UPDATE products SET title = $1, author = $2, category = $3, price = $4, image = $5 WHERE id = $6 RETURNING *",
      [title, author, category, parseInt(price), image, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: `Produk berhasil diupdate`,
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

// DELETE - Hapus produk (HANYA ADMIN)
router.delete("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: `Produk berhasil dihapus`,
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
