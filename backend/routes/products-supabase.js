/**
 * Products Routes dengan Supabase
 * Dokumentasi Supabase: https://supabase.com/docs/reference/javascript/select
 */

const express = require("express");
const router = express.Router();
const { supabase } = require("../db/supabase");
const { verifyToken, checkRole } = require("../middleware/auth");

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /products
 * Mendapatkan semua produk (PUBLIC)
 */
router.get("/", async (req, res) => {
  try {
    // Fetch products WITH category data via join
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        author,
        category_id,
        price,
        stock,
        image,
        created_at,
        categories:category_id(id, name, slug)
      `)
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data produk",
        error: error.message
      });
    }

    // Transform data to include category name at root level
    const transformedData = (data || []).map(product => {
      const categoryData = Array.isArray(product.categories) ? product.categories[0] : product.categories;
      return {
        id: product.id,
        title: product.title,
        author: product.author,
        category_id: product.category_id,
        category: categoryData?.name || `Category ${product.category_id}`,
        category_name: categoryData?.name || `Category ${product.category_id}`,
        price: product.price,
        stock: product.stock,
        image: product.image,
        created_at: product.created_at
      };
    });

    res.json({
      success: true,
      data: transformedData
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

/**
 * GET /products/:id
 * Mendapatkan detail produk (PUBLIC)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
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
 * POST /products
 * Membuat produk baru (ADMIN ONLY)
 */
router.post("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { title, author, category_id, price, stock, image } = req.body;

    // Map category to category_id if category is sent
    const category = req.body.category || req.body.category_id;

    // Validasi input
    if (!title || !author || !category) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: title, author, category_id (atau category), price"
      });
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Price wajib diisi"
      });
    }

    console.log("➕ Creating new product:", { title, author, category_id: category || category_id, price });

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          title,
          author,
          category_id: parseInt(category || category_id),
          price: parseInt(price),
          stock: stock ? parseInt(stock) : 0,
          image: image || null
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error creating product:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal membuat produk",
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat",
      data: data[0]
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

/**
 * PUT /products/:id
 * Update produk (ADMIN ONLY)
 */
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category_id, price, stock, image } = req.body;

    // Map category to category_id if category is sent
    const category = req.body.category || req.body.category_id;

    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (category_id || category) updateData.category_id = parseInt(category_id || category);
    if (price) updateData.price = parseInt(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (image) updateData.image = image;

    console.log("📝 Updating product", id, "with:", updateData);

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", parseInt(id))
      .select();

    if (error) {
      console.error("❌ Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal update produk",
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
      data: data[0]
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

/**
 * DELETE /products/:id
 * Hapus produk (ADMIN ONLY)
 */
router.delete("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      console.error("❌ Error deleting product:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal hapus produk"
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil dihapus"
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
