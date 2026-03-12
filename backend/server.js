#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const path = require("path");
const initializeDatabase = require("./db/schema");
const seedDatabase = require("./db/seeder");

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
const publicPath = path.join(__dirname, '../login-dashboard/public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Routes
app.get("/", (req, res) => {
  res.send("API Toko Buku Aktif 🚀");
});

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const categoryRoutes = require("./routes/categories");
app.use("/categories", categoryRoutes);

const transactionRoutes = require("./routes/transactions");
app.use("/transactions", transactionRoutes);

// Checkout endpoint...
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: "Items dan total wajib diisi"
      });
    }
    const user_id = 3;
    const transaction_code = `ORDER-${Date.now()}`;
    res.json({
      success: true,
      message: "Order berhasil",
      data: {
        transaction_code,
        items,
        total,
        status: "completed",
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// Books endpoint
app.get("/api/books", (req, res) => {
  res.json([
    { id: 1, title: "Cerita Rakyat Nusantara", author: "Murti Bunanta", category_name: "Cerita Rakyat", price: 75000, image: "/images/book-1.jpg" },
    { id: 2, title: "Si Kancil Penggalau", author: "Suwardi", category_name: "Fabel", price: 65000, image: "/images/book-2.jpg" },
    { id: 3, title: "Legenda Bukit Merah", author: "Suciwati", category_name: "Legenda", price: 80000, image: "/images/book-3.jpg" },
    { id: 4, title: "Petualangan Anak Negeri", author: "Seno Gumira Ajidarma", category_name: "Petualangan", price: 90000, image: "/images/book-4.jpg" },
    { id: 5, title: "Dongeng Sebelum Tidur", author: "Harun Erwin", category_name: "Dongeng", price: 70000, image: "/images/book-5.jpg" },
    { id: 6, title: "Fantasi Dunia Lain", author: "Bambang Irawan", category_name: "Fantasi", price: 85000, image: "/images/book-6.jpg" },
    { id: 7, title: "Sejarah Nusantara", author: "Taufik Ismail", category_name: "Sejarah", price: 88000, image: "/images/book-7.jpg" },
    { id: 8, title: "Mitologi Lokal", author: "Dr. Koentjaraningrat", category_name: "Mitos", price: 78000, image: "/images/book-8.jpg" },
    { id: 9, title: "Timun Mas dan Raksasa", author: "Bambang Sugiharto", category_name: "Cerita Rakyat", price: 72000, image: "/images/book-9.jpg" },
    { id: 10, title: "Sang Malin Kundang", author: "Awang Rasyid", category_name: "Legenda", price: 82000, image: "/images/book-10.jpg" }
  ]);
});

// Start server
(async () => {
  try {
    console.log("\n========================================");
    console.log("🚀 Initializing Web Toko Backend...");
    console.log("========================================\n");

    // Initialize database
    await initializeDatabase();
    
    // Seed data
    await seedDatabase();

    // Start listening
    const server = app.listen(5000, () => {
      console.log("\n========================================");
      console.log("✅ Backend Running Successfully!");
      console.log("========================================");
      console.log("📍 URL: http://localhost:5000");
      console.log("📱 Press Ctrl+C to stop");
      console.log("========================================\n");
    });

    // Handle shutdown gracefully
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down server...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    // Keep process alive
    process.on('uncaughtException', (err) => {
      console.error('❌ Error:', err);
    });

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
})();

// Prevent process from exiting
setInterval(() => {}, 1000);
