const express = require("express");
const router = express.Router();

// GET semua categories
router.get("/", async (req, res) => {
  try {
    const categories = [
      {
        id: 1,
        name: "Cerita Rakyat",
        slug: "cerita-rakyat",
        description: "Koleksi cerita rakyat tradisional Indonesia"
      },
      {
        id: 2,
        name: "Fabel",
        slug: "fabel",
        description: "Cerita fabel dengan pesan moral"
      },
      {
        id: 3,
        name: "Legenda",
        slug: "legenda",
        description: "Kisah legenda dan mitos lokal"
      },
      {
        id: 4,
        name: "Petualangan",
        slug: "petualangan",
        description: "Cerita petualangan yang seru"
      },
      {
        id: 5,
        name: "Dongeng",
        slug: "dongeng",
        description: "Dongeng anak-anak sebelum tidur"
      },
      {
        id: 6,
        name: "Fantasi",
        slug: "fantasi",
        description: "Cerita fantasi dan imajinasi"
      },
      {
        id: 7,
        name: "Sejarah",
        slug: "sejarah",
        description: "Kisah sejarah dan tokoh bersejarah"
      },
      {
        id: 8,
        name: "Mitos",
        slug: "mitos",
        description: "Cerita mitos dan kepercayaan lokal"
      }
    ];
    res.json({
      success: true,
      data: categories
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
    
    const categories = [
      {
        id: 1,
        name: "Cerita Rakyat",
        slug: "cerita-rakyat",
        description: "Koleksi cerita rakyat tradisional Indonesia"
      },
      {
        id: 2,
        name: "Fabel",
        slug: "fabel",
        description: "Cerita fabel dengan pesan moral"
      },
      {
        id: 3,
        name: "Legenda",
        slug: "legenda",
        description: "Kisah legenda dan mitos lokal"
      }
    ];

    const category = categories.find(c => c.id === parseInt(id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// POST create category (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name dan slug wajib diisi"
      });
    }

    const newCategory = {
      id: Date.now(),
      name,
      slug,
      description
    };

    res.status(201).json({
      success: true,
      message: "Category berhasil dibuat",
      data: newCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// PUT update category (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name dan slug wajib diisi"
      });
    }

    const updatedCategory = {
      id: parseInt(id),
      name,
      slug,
      description
    };

    res.json({
      success: true,
      message: "Category berhasil diupdate",
      data: updatedCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// DELETE category (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: "Category berhasil dihapus"
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
