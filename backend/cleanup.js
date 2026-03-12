const pool = require('./db/db');

const cleanupProducts = async () => {
  try {
    console.log('=== CLEANUP PRODUCTS ===\n');

    // Hapus Ekonomi Indonesia
    const result = await pool.query('DELETE FROM products WHERE title = $1', ['Ekonomi Indonesia']);
    
    console.log(`✅ Produk "Ekonomi Indonesia" dihapus (${result.rowCount} rows)`);

    // Check remaining products
    const check = await pool.query('SELECT id, title FROM products ORDER BY id ASC');
    
    console.log('\nProduk yang tersisa:');
    check.rows.forEach(p => {
      console.log(`ID ${p.id}: ${p.title}`);
    });

    console.log('\n✅ Cleanup selesai! Sekarang ID 11 kosong lagi.');
    console.log('Admin bisa nambah "Sejarah Indonesia" sendiri dan akan dapat ID 11');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

cleanupProducts();
