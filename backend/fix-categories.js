const pool = require('./db/db');

const fixCategories = async () => {
  try {
    console.log('=== FIX CATEGORIES WITH SPACES ===\n');
    
    // Fix "Dongeng "
    await pool.query(
      "UPDATE products SET category = 'Dongeng' WHERE category = 'Dongeng '"
    );
    console.log('✅ Fixed "Dongeng "');

    // Fix "Fantasi "
    await pool.query(
      "UPDATE products SET category = 'Fantasi' WHERE category = 'Fantasi '"
    );
    console.log('✅ Fixed "Fantasi "');

    // Fix "Legenda "
    await pool.query(
      "UPDATE products SET category = 'Legenda' WHERE category = 'Legenda '"
    );
    console.log('✅ Fixed "Legenda "');

    // Verify
    console.log('\n=== VERIFICATION ===\n');
    const verify = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );
    
    verify.rows.forEach(cat => {
      console.log(`✅ "${cat.category}"`);
    });

    console.log('\n✅ Semua kategori sudah rapi! Filter akan berfungsi dengan baik!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixCategories();
