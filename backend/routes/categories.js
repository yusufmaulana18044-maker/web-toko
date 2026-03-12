const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET semua categories (PUBLIC - tidak perlu login)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
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

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan"
      });
    }

    res.json({
      success: true,
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

// POST create category (HANYA ADMIN)
router.post("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name dan slug wajib diisi"
      });
    }

    // Check if slug already exists
    const checkResult = await pool.query(
      "SELECT id FROM categories WHERE slug = $1",
      [slug]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Slug sudah digunakan"
      });
    }

    const result = await pool.query(
      "INSERT INTO categories (name, slug, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [name, slug, description]
    );

    res.status(201).json({
      success: true,
      message: "Category berhasil dibuat",
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

// PUT update category (HANYA ADMIN)
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name dan slug wajib diisi"
      });
    }

    // Check if slug already exists (in other categories)
    const checkResult = await pool.query(
      "SELECT id FROM categories WHERE slug = $1 AND id != $2",
      [slug, parseInt(id)]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Slug sudah digunakan"
      });
    }

    const result = await pool.query(
      "UPDATE categories SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, slug, description, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Category berhasil diupdate",
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

// DELETE category (HANYA ADMIN)
router.delete("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Category berhasil dihapus",
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
