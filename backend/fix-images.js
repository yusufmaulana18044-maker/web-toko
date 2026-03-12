const pool = require('./db/db');

const fixImages = async () => {
  try {
    console.log('=== FIXING IMAGE PATHS ===\n');
    
    // Update Laskar Pelangi image
    const result = await pool.query(
      'UPDATE products SET image = $1 WHERE title = $2 RETURNING *',
      ['/images/book-1.jpg', 'Laskar Pelangi']
    );
    
    console.log('✅ Updated Laskar Pelangi image:');
    console.log(result.rows[0]);
    
    // Verify all products now have images
    const verify = await pool.query('SELECT id, title, image FROM products ORDER BY id');
    
    console.log('\n\n=== VERIFICATION ===');
    console.log('All products with image paths:');
    verify.rows.forEach(product => {
      console.log(`${product.id}. ${product.title} → ${product.image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixImages();
