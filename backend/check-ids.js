const pool = require('./db/db');

const checkProductIds = async () => {
  try {
    console.log('=== CHECK ALL PRODUCT IDs ===\n');
    
    const result = await pool.query('SELECT id, title FROM products ORDER BY id ASC');
    
    console.log('Semua produk dengan ID mereka:');
    result.rows.forEach(p => {
      console.log(`ID ${p.id}: ${p.title}`);
    });

    // Cek gap di ID
    const ids = result.rows.map(p => p.id);
    console.log('\n\nAnalysis:');
    console.log(`Total produk: ${result.rows.length}`);
    console.log(`ID terendah: ${Math.min(...ids)}`);
    console.log(`ID tertinggi: ${Math.max(...ids)}`);
    
    // Cari ID yang hilang
    const missing = [];
    for (let i = Math.min(...ids); i <= Math.max(...ids); i++) {
      if (!ids.includes(i)) {
        missing.push(i);
      }
    }
    
    if (missing.length > 0) {
      console.log(`\n⚠️  ID yang hilang (gap): ${missing.join(', ')}`);
    } else {
      console.log('\n✅ Tidak ada gap di ID');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkProductIds();
