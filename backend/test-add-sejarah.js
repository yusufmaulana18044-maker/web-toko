const http = require('http');

const testAddProduct = async () => {
  try {
    console.log('=== TEST ADD PRODUCT (Sejarah Indonesia) ===\n');

    // Langkah 1: Login sebagai admin
    console.log('Step 1: Login as admin...');
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const adminToken = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Login berhasil\n');
            resolve(response.token);
          } else {
            reject(new Error(response.message));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
      req.end();
    });

    // Langkah 2: Add product
    console.log('Step 2: Adding new product "Sejarah Indonesia"...');
    const addOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    };

    const productData = {
      title: 'Sejarah Indonesia',
      author: 'Tim Sejarah',
      category: 'Sejarah',
      price: '85000',
      stock: '25',
      image: '/images/test-sejarah.jpg'
    };

    await new Promise((resolve, reject) => {
      const req = http.request(addOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('\nResponse from API:');
            console.log(`Status: ${response.success ? '✅ Success' : '❌ Failed'}`);
            console.log(`Message: ${response.message}`);
            
            if (response.success) {
              console.log('\n✅ Produk berhasil ditambahkan!');
              console.log(`Produk baru:`);
              console.log(`- Title: ${response.data.title}`);
              console.log(`- ID: ${response.data.id}`);
              console.log(`- Stock: ${response.data.stock}`);
            } else {
              console.log('\n❌ Gagal menambahkan produk');
              console.log(JSON.stringify(response, null, 2));
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(productData));
      req.end();
    });

    // Langkah 3: Verify produk sudah ada
    console.log('\n\nStep 3: Verifying product was added...');
    
    const verifyOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/products',
      method: 'GET'
    };

    await new Promise((resolve, reject) => {
      const req = http.request(verifyOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const products = JSON.parse(data);
          const found = products.find(p => p.title.toLowerCase().includes('sejarah'));
          
          if (found) {
            console.log('✅ Produk "Sejarah Indonesia" ditemukan di database!');
            console.log(`- Title: ${found.title}`);
            console.log(`- ID: ${found.id}`);
            console.log(`- Author: ${found.author}`);
            console.log(`- Category: ${found.category}`);
            console.log(`- Stock: ${found.stock}`);
          } else {
            console.log('❌ Produk "Sejarah Indonesia" masih tidak ditemukan!');
          }
          resolve();
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log('\n✅ Test selesai');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAddProduct();
