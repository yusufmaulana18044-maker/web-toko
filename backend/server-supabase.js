#!/usr/bin/env node

/**
 * Web Toko Server - Supabase Edition
 * Main entry point untuk backend server dengan Supabase
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Supabase
const { supabase, testConnection } = require("./db/supabase");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
const publicPath = path.join(__dirname, "../login-dashboard/public");
console.log("📁 Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Routes dengan Supabase
const authSupabaseRoutes = require("./routes/auth-supabase");
const productsSupabaseRoutes = require("./routes/products-supabase");
const categoriesSupabaseRoutes = require("./routes/categories-supabase");
const transactionsSupabaseRoutes = require("./routes/transactions-supabase");

// ============ API ROUTES ============

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Web Toko dengan Supabase aktif!",
    version: "2.0.0",
    mode: "supabase"
  });
});

// Auth routes
app.use("/auth", authSupabaseRoutes);

// Products routes
app.use("/products", productsSupabaseRoutes);

// Categories routes
app.use("/categories", categoriesSupabaseRoutes);

// Transactions routes
app.use("/transactions", transactionsSupabaseRoutes);

// ============ LEGACY ENDPOINTS (untuk backward compatibility) ============

/**
 * GET /users
 * Get all users (untuk compatibility dengan frontend)
 */
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, role, is_approved")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/orders
 * Customer checkout endpoint
 */
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: "Items dan total wajib diisi"
      });
    }

    const user_id = 3; // Default ke user role
    const transaction_code = `ORDER-${Date.now()}`;

    // Try to insert ke database
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id,
            transaction_code,
            items: Array.isArray(items) ? items : JSON.parse(items),
            total_amount: parseInt(total),
            status: "completed",
            payment_method: "cash",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      const orderData = data[0];

      res.status(201).json({
        success: true,
        message: "Order berhasil dibuat",
        data: {
          id: orderData.id,
          transaction_code: orderData.transaction_code,
          items,
          total: orderData.total_amount,
          status: orderData.status,
          created_at: orderData.created_at
        }
      });
    } catch (dbError) {
      console.error("📊 Database error:", dbError.message);
      
      // Fallback jika database error
      const orderId = Math.floor(Date.now() / 1000);

      res.status(201).json({
        success: true,
        message: "Order berhasil dibuat (mode fallback)",
        data: {
          id: orderId,
          transaction_code,
          items,
          total,
          status: "pending",
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

/**
 * GET /api/books
 * Get all books (for backward compatibility)
 */
app.get("/api/books", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, author, category as category_name, price, image")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.json(data || []);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ============ ERROR HANDLING ============

/**
 * 404 Not Found
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} tidak ditemukan`
  });
});

/**
 * Error middleware
 */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error"
  });
});

// ============ SERVER START ============

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    // Test Supabase connection
    const connected = await testConnection();

    if (!connected) {
      console.warn("⚠️  WARNING: Supabase connection test failed");
      console.warn("⚠️  Server will start anyway, but may have database issues");
    }

    // Start listening
    app.listen(PORT, () => {
      console.log("\n");
      console.log("╔════════════════════════════════════════╗");
      console.log("║    🚀 WEB TOKO SERVER STARTED 🚀      ║");
      console.log("╠════════════════════════════════════════╣");
      console.log(`║  URL: http://localhost:${PORT}`);
      console.log(`║  Mode: Supabase Database`);
      console.log(`║  Env: ${process.env.NODE_ENV || "development"}`);
      console.log("╚════════════════════════════════════════╝");
      console.log("\n📚 API Routes:\n");
      console.log("  🔐 Authentication:");
      console.log("     POST   /auth/login");
      console.log("     POST   /auth/register");
      console.log("     POST   /auth/logout");
      console.log("     GET    /auth/users/ (ADMIN)");
      console.log("");
      console.log("  📦 Products:");
      console.log("     GET    /products");
      console.log("     POST   /products (ADMIN)");
      console.log("     PUT    /products/:id (ADMIN)");
      console.log("     DELETE /products/:id (ADMIN)");
      console.log("");
      console.log("  🏷️  Categories:");
      console.log("     GET    /categories");
      console.log("     POST   /categories (ADMIN)");
      console.log("     PUT    /categories/:id (ADMIN)");
      console.log("     DELETE /categories/:id (ADMIN)");
      console.log("");
      console.log("  💳 Transactions:");
      console.log("     GET    /transactions");
      console.log("     POST   /transactions (KASIR/ADMIN)");
      console.log("     PUT    /transactions/:id (KASIR/ADMIN)");
      console.log("     DELETE /transactions/:id (KASIR/ADMIN)");
      console.log("");
      console.log("  🛒 Checkout:");
      console.log("     POST   /api/orders");
      console.log("\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start server
startServer();

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("📛 SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📛 SIGINT signal received: closing HTTP server");
  process.exit(0);
});

module.exports = app;
