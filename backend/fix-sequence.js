const pool = require('./db/db');

const fixSequence = async () => {
  try {
    console.log('=== FIX DATABASE SEQUENCE ===\n');
    
    // Check current max ID
    const maxResult = await pool.query('SELECT MAX(id) as max_id FROM products');
    const maxId = maxResult.rows[0].max_id;
    console.log(`Max ID saat ini: ${maxId}`);

    // Reset sequence ke max_id
    console.log(`\nMereset sequence ke: ${maxId + 1}\n`);
    
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('products', 'id'),
        ${maxId},
        true
      )
    `);

    console.log('✅ Sequence sudah di-reset!');
    console.log(`Produk berikutnya akan mendapat ID: ${maxId + 1}`);

    // Verify
    const testInsert = await pool.query('SELECT currval(pg_get_serial_sequence(\'products\', \'id\'))');
    console.log(`Verification - Current sequence value: ${testInsert.rows[0].currval}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixSequence();
