const pool = require('./db/db');

const testImages = async () => {
  try {
    console.log('=== TEST IMAGES IN DATABASE ===\n');
    
    const result = await pool.query('SELECT id, title, image FROM products LIMIT 10');
    
    console.log('Products with image paths:');
    result.rows.forEach(product => {
      console.log(`\nID: ${product.id}`);
      console.log(`Title: ${product.title}`);
      console.log(`Image Path: ${product.image}`);
    });
    
    console.log('\n\n=== IMAGE FILE CHECK ===');
    const fs = require('fs');
    const path = require('path');
    
    const imageDir = path.join(__dirname, '../login-dashboard/public/images');
    console.log('\nChecking directory:', imageDir);
    
    if (fs.existsSync(imageDir)) {
      const files = fs.readdirSync(imageDir);
      console.log('Files found in /public/images/:', files);
    } else {
      console.log('❌ Directory does not exist!');
    }
    
    console.log('\n✅ Test complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testImages();
