const http = require('http');

const addSejarahIndonesia = async () => {
  try {
    console.log('=== ADD SEJARAH INDONESIA ===\n');

    // Step 1: Login as admin
    console.log('Step 1: Login as admin...');
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const token = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.success) {
            console.log('✅ Login berhasil\n');
            resolve(resp.token);
          } else {
            reject(new Error(resp.message));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
      req.end();
    });

    // Step 2: Add Sejarah Indonesia product
    console.log('Step 2: Adding "Sejarah Indonesia" product...');
    const addOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const product = await new Promise((resolve, reject) => {
      const req = http.request(addOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.success) {
            resolve(resp.data);
          } else {
            reject(new Error(resp.message));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({
        title: 'Sejarah Indonesia',
        author: 'Tim Sejarawan Indonesia',
        category: 'Sejarah',
        price: '95000',
        stock: '25',
        image: '/images/SEJARAH-INDONESIA-II.jpg'
      }));
      req.end();
    });

    console.log('✅ Produk berhasil ditambahkan!\n');
    console.log('Detail produk:');
    console.log(`  ID: ${product.id}`);
    console.log(`  Judul: ${product.title}`);
    console.log(`  Author: ${product.author}`);
    console.log(`  Kategori: ${product.category}`);
    console.log(`  Harga: Rp ${product.price}`);
    console.log(`  Stock: ${product.stock} unit`);
    console.log(`  Gambar: ${product.image}`);

    if (product.id === 11) {
      console.log('\n✅✅✅ SEMPURNA! Produk dapat ID 11 (terisi gap otomatis)!');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addSejarahIndonesia();
