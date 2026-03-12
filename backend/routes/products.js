const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { verifyToken, checkRole } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../login-dashboard/public/images"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `book-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (jpeg, jpg, png, gif) yang diizinkan"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// POST - Upload gambar
router.post("/upload-image", verifyToken, checkRole("admin"), upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload"
      });
    }

    const imagePath = `/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: "Gambar berhasil diupload",
      imagePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
});

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
    const { title, author, category, price, stock, image } = req.body;

    if (!title || !author || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, author, category, dan price wajib diisi"
      });
    }

    // Cari ID kosong terkecil (untuk mengisi gap ketika ada produk yang dihapus)
    let idToUse;
    
    // Cek apakah ada gap di ID
    const gapCheck = await pool.query(
      "SELECT id + 1 as next_id FROM products WHERE (id + 1) NOT IN (SELECT id FROM products) ORDER BY id LIMIT 1"
    );
    
    if (gapCheck.rows.length > 0) {
      // Ada gap, gunakan ID gap yang terkecil
      idToUse = gapCheck.rows[0].next_id;
    } else {
      // Tidak ada gap, gunakan ID baru (max + 1)
      const maxId = await pool.query("SELECT MAX(id) as max_id FROM products");
      idToUse = (maxId.rows[0].max_id || 0) + 1;
    }

    // Insert dengan ID yang sudah ditentukan
    const result = await pool.query(
      "INSERT INTO products (id, title, author, category, price, stock, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *",
      [idToUse, title, author, category, parseInt(price), parseInt(stock) || 0, image]
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
      message: "Server error: " + error.message
    });
  }
});

// PUT - Update produk (HANYA ADMIN)
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { title, author, category, price, stock, image } = req.body;
    const { id } = req.params;

    if (!title || !author || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, author, category, dan price wajib diisi"
      });
    }

    const result = await pool.query(
      "UPDATE products SET title = $1, author = $2, category = $3, price = $4, stock = $5, image = $6 WHERE id = $7 RETURNING *",
      [title, author, category, parseInt(price), parseInt(stock) || 0, image, parseInt(id)]
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
