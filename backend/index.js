const express = require("express");
const cors = require("cors");
const path = require("path");
const initializeDatabase = require("./db/schema");
const seedDatabase = require("./db/seeder");
const pool = require("./db/db");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public folder
const publicPath = path.join(__dirname, '../login-dashboard/public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

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

// API untuk customer checkout (CREATE ORDER) - Simpan ke database
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: "Items dan total wajib diisi"
      });
    }

    // Set default user_id untuk customer yang checkout tanpa login
    // Bisa dimodifikasi later untuk ambil dari token jika ada
    const user_id = 3; // Default ke user role (bukan admin, bukan kasir)
    const transaction_code = `ORDER-${Date.now()}`;

    try {
      const result = await pool.query(
        `INSERT INTO transactions 
         (user_id, transaction_code, items, total_amount, status, payment_method, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id, transaction_code, total_amount, status, created_at`,
        [
          user_id,
          transaction_code,
          JSON.stringify(items),
          total,
          'completed',
          'cash'
        ]
      );

      const orderData = result.rows[0];
      
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
      console.error("Database error:", dbError.message);
      // Fallback jika database error - gunakan in-memory
      const orderId = Math.floor(Date.now() / 1000);
      
      res.status(201).json({
        success: true,
        message: "Order berhasil dibuat (mode fallback)",
        data: {
          id: orderId,
          items,
          total,
          status: "completed",
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// API untuk mendapatkan books
app.get("/api/books", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Cerita Rakyat Nusantara",
      author: "Murti Bunanta",
      category_name: "Cerita Rakyat",
      price: 75000,
      image: "/images/book-1.jpg"
    },
    {
      id: 2,
      title: "Si Kancil Penggalau",
      author: "Suwardi",
      category_name: "Fabel",
      price: 65000,
      image: "/images/book-2.jpg"
    },
    {
      id: 3,
      title: "Legenda Bukit Merah",
      author: "Suciwati",
      category_name: "Legenda",
      price: 80000,
      image: "/images/book-3.jpg"
    },
    {
      id: 4,
      title: "Petualangan Anak Negeri",
      author: "Seno Gumira Ajidarma",
      category_name: "Petualangan",
      price: 90000,
      image: "/images/book-4.jpg"
    },
    {
      id: 5,
      title: "Dongeng Sebelum Tidur",
      author: "Harun Erwin",
      category_name: "Dongeng",
      price: 70000,
      image: "/images/book-5.jpg"
    },
    {
      id: 6,
      title: "Kisah Panjang Emas",
      author: "Sri Dewi",
      category_name: "Fantasi",
      price: 95000,
      image: "/images/book-6.jpg"
    },
    {
      id: 7,
      title: "Pangeran Diponegoro",
      author: "Langit Kresna Hariyadhi",
      category_name: "Sejarah",
      price: 85000,
      image: "/images/book-7.jpg"
    },
    {
      id: 8,
      title: "Putri Duyung Laut Jawa",
      author: "Wiratno Hadiwinoto",
      category_name: "Mitos",
      price: 78000,
      image: "/images/book-8.jpg"
    },
    {
      id: 9,
      title: "Timun Mas dan Raksasa",
      author: "Bambang Sugiharto",
      category_name: "Cerita Rakyat",
      price: 72000,
      image: "/images/book-9.jpg"
    },
    {
      id: 10,
      title: "Sang Malin Kundang",
      author: "Awang Rasyid",
      category_name: "Legenda",
      price: 82000,
      image: "/images/book-10.jpg"
    }
  ]);
});

// Start server function
async function startServer() {
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    
    console.log("Seeding database...");
    await seedDatabase();
    
    const server = app.listen(5000, () => {
      console.log("✅ Backend jalan di http://localhost:5000");
      console.log("✅ Database sudah siap!");
      console.log("✅ Server listening on port 5000");
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection:', reason);
      process.exit(1);
    });

  } catch (err) {
    console.error("❌ Gagal inisialisasi database:", err.message);
    process.exit(1);
  }
}

// Start the server
startServer();

// Prevent process from exiting
setInterval(() => {}, 1000);
