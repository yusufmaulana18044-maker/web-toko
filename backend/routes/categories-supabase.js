/**
 * Categories Routes dengan Supabase
 */

const express = require("express");
const router = express.Router();
const { supabase } = require("../db/supabase");
const { verifyToken, checkRole } = require("../middleware/auth");

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /categories
 * Mendapatkan semua kategori (PUBLIC)
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Error fetching categories:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data kategori"
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
 * GET /categories/:id
 * Mendapatkan detail kategori (PUBLIC)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan"
      });
    }

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

// ============ PROTECTED ENDPOINTS (ADMIN ONLY) ============

/**
 * POST /categories
 * Membuat kategori baru (ADMIN ONLY)
 */
router.post("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: name, slug"
      });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name,
          slug: slug.toLowerCase().replace(/\s+/g, "-"),
          description: description || null
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error creating category:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal membuat kategori: " + error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
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
 * PUT /categories/:id
 * Update kategori (ADMIN ONLY)
 */
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase().replace(/\s+/g, "-");
    if (description !== undefined) updateData.description = description;

    console.log("📝 Updating category", id, "with:", updateData);

    const { data, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", parseInt(id))
      .select();

    if (error) {
      console.error("❌ Error updating category:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal update kategori: " + error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Kategori berhasil diupdate",
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
 * DELETE /categories/:id
 * Hapus kategori (ADMIN ONLY)
 */
router.delete("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      console.error("❌ Error deleting category:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal hapus kategori: " + error.message
      });
    }

    res.json({
      success: true,
      message: "Kategori berhasil dihapus"
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
