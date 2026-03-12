const pool = require("./db");

// Script untuk membuat tabel users, products, categories
const initializeDatabase = async () => {
  try {
    // Buat tabel users terlebih dahulu (karena transactions punya foreign key)
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'kasir')),
        is_approved BOOLEAN DEFAULT FALSE,
        approved_by INTEGER,
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createUsersTableQuery);
    console.log("✅ Tabel users berhasil dibuat");

    // Buat tabel categories
    const createCategoriesTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createCategoriesTableQuery);
    console.log("✅ Tabel categories berhasil dibuat");

    // Buat tabel products
    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER DEFAULT 0,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await pool.query(createProductsTableQuery);
    console.log("✅ Tabel products berhasil dibuat");
    
    // Add stock column jika belum ada (untuk existing tables)
    try {
      await pool.query(`
        ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
      `);
      console.log("✅ Kolom stock berhasil ditambahkan");
    } catch (err) {
      console.log("ℹ️  Kolom stock sudah ada atau tidak perlu ditambahkan");
    }

    // Buat tabel transactions
    const createTransactionsTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        transaction_code VARCHAR(50) UNIQUE,
        items JSONB NOT NULL,
        total_amount INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        payment_method VARCHAR(50),
        shipping_address VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    await pool.query(createTransactionsTableQuery);
    console.log("✅ Tabel transactions berhasil dibuat");

    // Test connection
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Koneksi database berhasil:", result.rows[0]);

  } catch (err) {
    console.error("❌ Error membuat tabel:", err.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
