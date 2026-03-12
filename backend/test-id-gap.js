const http = require('http');

const testIdGap = async () => {
  try {
    console.log('=== TEST AUTO-FILL ID GAP ===\n');

    // Step 1: Login
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
          resolve(resp.token);
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
      req.end();
    });
    console.log('✅ Login berhasil\n');

    // Step 2: Delete product ID 11
    console.log('Step 2: Deleting product ID 11...');
    const delOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/products/11',
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    };

    await new Promise((resolve, reject) => {
      const req = http.request(delOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.success) {
            console.log('✅ Produk ID 11 dihapus\n');
          }
          resolve();
        });
      });
      req.on('error', reject);
      req.end();
    });

    // Step 3: Delete product ID 12
    console.log('Step 3: Deleting product ID 12 (Sejarah Indonesia)...');
    const del2Options = {
      hostname: 'localhost',
      port: 5000,
      path: '/products/12',
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    };

    await new Promise((resolve, reject) => {
      const req = http.request(del2Options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.success) {
            console.log('✅ Produk ID 12 dihapus\n');
          }
          resolve();
        });
      });
      req.on('error', reject);
      req.end();
    });

    // Step 4: Add new product
    console.log('Step 4: Adding new product "Ekonomi Indonesia"...');
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

    const newProduct = await new Promise((resolve, reject) => {
      const req = http.request(addOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          resolve(resp.data);
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({
        title: 'Ekonomi Indonesia',
        author: 'Tim Ekonomi',
        category: 'Ekonomi',
        price: '75000',
        stock: '20',
        image: '/images/test-ekonomi.jpg'
      }));
      req.end();
    });

    console.log('✅ Produk ditambahkan!');
    console.log(`   ID yang digunakan: ${newProduct.id}`);
    console.log(`   Judul: ${newProduct.title}\n`);

    // Step 5: Verify
    if (newProduct.id === 11) {
      console.log('✅✅✅ BERHASIL! ID 11 (gap) terisi otomatis!');
    } else {
      console.log(`❌ ID yang diterima: ${newProduct.id} (seharusnya 11)`);
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testIdGap();
