const http = require('http');

const testProducts = async () => {
  try {
    console.log('=== CHECK PRODUCTS ===\n');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/products',
      method: 'GET'
    };

    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const products = JSON.parse(data);
          console.log(`Total produk: ${products.length}\n`);
          
          console.log('Daftar semua produk:');
          products.forEach(p => {
            console.log(`${p.id}. ${p.title}`);
            console.log(`   Author: ${p.author}`);
            console.log(`   Kategori: ${p.category}`);
            console.log(`   Harga: Rp ${p.price}`);
            console.log(`   Stock: ${p.stock}`);
            console.log(`   Image: ${p.image}\n`);
          });

          // Cari produk "sejarah" atau "indonesia"
          const searchResult = products.filter(p => 
            p.title.toLowerCase().includes('sejarah') || 
            p.title.toLowerCase().includes('indonesia')
          );

          if (searchResult.length > 0) {
            console.log('\n✅ Produk "sejarah indonesia" DITEMUKAN:');
            searchResult.forEach(p => {
              console.log(`- ${p.title} (ID: ${p.id}, Stock: ${p.stock})`);
            });
          } else {
            console.log('\n❌ Produk "sejarah indonesia" TIDAK DITEMUKAN di database!');
          }

          resolve();
        });
      });

      req.on('error', reject);
      req.end();
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testProducts();
