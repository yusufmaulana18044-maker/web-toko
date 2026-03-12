const pool = require('./db/db');

const checkDongengBooks = async () => {
  try {
    console.log('=== CHECK DONGENG BOOKS ===\n');
    
    // Cari produk dengan kategori "Dongeng"
    const result = await pool.query(
      "SELECT id, title, category FROM products WHERE LOWER(category) LIKE LOWER('%dongeng%') ORDER BY id"
    );
    
    console.log(`Produk dengan kategori "Dongeng" atau mengandung "dongeng":`);
    console.log(`Total: ${result.rows.length}\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ Tidak ada produk dengan kategori "Dongeng"');
    } else {
      result.rows.forEach(book => {
        console.log(`ID ${book.id}: ${book.title}`);
        console.log(`   Kategori: "${book.category}"\n`);
      });
    }

    // Cek semua kategori yang ada
    console.log('\n=== ALL CATEGORIES IN DATABASE ===\n');
    const allCats = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );
    
    allCats.rows.forEach(cat => {
      console.log(`- "${cat.category}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDongengBooks();
