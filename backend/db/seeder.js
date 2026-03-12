const pool = require("./db");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    // Data akun default
    const defaultAccounts = [
      {
        username: "admin",
        email: "admin@example.com",
        full_name: "Administrator",
        phone: "081234567890",
        password: "admin123",
        role: "admin"
      },
      {
        username: "kasir",
        email: "kasir@example.com",
        full_name: "Kasir Toko",
        phone: "081234567891",
        password: "kasir123",
        role: "kasir"
      },
      {
        username: "user",
        email: "user@example.com",
        full_name: "User Toko",
        phone: "081234567892",
        password: "user123",
        role: "user"
      }
    ];

    // Seed Users
    for (const account of defaultAccounts) {
      const checkResult = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [account.username]
      );

      if (checkResult.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(account.password, 10);
        await pool.query(
          "INSERT INTO users (username, email, full_name, phone, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
          [account.username, account.email, account.full_name, account.phone, hashedPassword, account.role]
        );
        console.log(`✅ Akun ${account.role} '${account.username}' berhasil dibuat`);
      } else {
        console.log(`ℹ️  Akun '${account.username}' sudah ada`);
      }
    }

    // Seed Categories
    const defaultCategories = [
      { name: "Cerita Rakyat", slug: "cerita-rakyat", description: "Koleksi cerita rakyat tradisional Indonesia" },
      { name: "Fabel", slug: "fabel", description: "Cerita fabel dengan pesan moral" },
      { name: "Legenda", slug: "legenda", description: "Kisah legenda dan mitos lokal" },
      { name: "Petualangan", slug: "petualangan", description: "Cerita petualangan yang seru" },
      { name: "Dongeng", slug: "dongeng", description: "Dongeng anak-anak sebelum tidur" },
      { name: "Fantasi", slug: "fantasi", description: "Cerita fantasi dan imajinasi" },
      { name: "Sejarah", slug: "sejarah", description: "Kisah sejarah dan tokoh bersejarah" },
      { name: "Mitos", slug: "mitos", description: "Cerita mitos dan kepercayaan lokal" }
    ];

    for (const category of defaultCategories) {
      const checkResult = await pool.query(
        "SELECT id FROM categories WHERE slug = $1",
        [category.slug]
      );

      if (checkResult.rows.length === 0) {
        await pool.query(
          "INSERT INTO categories (name, slug, description, created_at) VALUES ($1, $2, $3, NOW())",
          [category.name, category.slug, category.description]
        );
        console.log(`✅ Kategori '${category.name}' berhasil dibuat`);
      } else {
        console.log(`ℹ️  Kategori '${category.name}' sudah ada`);
      }
    }

    // Seed Products
    const defaultProducts = [
      { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Sastra Anak", price: 85000, image: "/images/book-1.jpg" },
      { title: "Si Kancil: Cerita Rakyat Indonesia", author: "Tradisional", category: "Fabel Anak", price: 65000, image: "/images/book-2.jpg" },
      { title: "Negeri di Ujung Tanduk", author: "Panuti Sudjiman", category: "Fantasi Anak", price: 70000, image: "/images/book-3.jpg" },
      { title: "Hansel dan Gretel Versi Indonesia", author: "Djemari", category: "Dongeng Klasik", price: 60000, image: "/images/book-4.jpg" },
      { title: "Malin Kundang", author: "Tradisional", category: "Legenda Indonesia", price: 55000, image: "/images/book-5.jpg" },
      { title: "Roro Jonggrang", author: "Tradisional", category: "Legenda Indonesia", price: 60000, image: "/images/book-6.jpg" },
      { title: "Dongeng Nusantara", author: "Antologi", category: "Antologi", price: 68000, image: "/images/book-7.jpg" },
      { title: "Cerita Anak Nusantara", author: "Kompilasi", category: "Antologi", price: 72000, image: "/images/book-8.jpg" },
      { title: "Dru dan Kisah Lima Kerajaan", author: "Clara Ng", category: "Kisah Inspiratif", price: 58000, image: "/images/book-9.jpg" },
      { title: "Kumpulan Cerita Ragam Indonesia", author: "Tim Dongeng", category: "Aktivitas", price: 45000, image: "/images/book-10.jpg" }
    ];

    for (const product of defaultProducts) {
      const checkResult = await pool.query(
        "SELECT id FROM products WHERE title = $1 AND author = $2",
        [product.title, product.author]
      );

      if (checkResult.rows.length === 0) {
        await pool.query(
          "INSERT INTO products (title, author, category, price, image, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
          [product.title, product.author, product.category, product.price, product.image]
        );
        console.log(`✅ Produk '${product.title}' berhasil dibuat`);
      } else {
        console.log(`ℹ️  Produk '${product.title}' sudah ada`);
      }
    }

    console.log("\n✅ Database seeding selesai!");

  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
  }
};

module.exports = seedDatabase;
