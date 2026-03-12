const http = require('http');

const testStockReduction = async () => {
  try {
    console.log('=== TEST STOCK REDUCTION ===\n');

    // Wait for backend
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 1: Check initial stock
    console.log('Step 1: Check initial stock of product ID 1 (Laskar Pelangi)...');
    
    let initialStock = 0;
    await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/products',
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const products = JSON.parse(data);
          const book1 = products.find(p => p.id === 1);
          if (book1) {
            initialStock = book1.stock;
            console.log(`Initial stock (ID 1): ${initialStock} units\n`);
          }
          resolve();
        });
      });
      req.on('error', reject);
      req.end();
    });

    // Step 2: Login as user
    console.log('Step 2: Login as user...');
    const token = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
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
      req.write(JSON.stringify({ username: 'user', password: 'user123' }));
      req.end();
    });

    // Step 3: Do checkout with 1 unit of product ID 1
    console.log('Step 3: Checkout 1 unit of product ID 1...');
    await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/transactions/user/checkout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.success) {
            console.log('✅ Checkout berhasil\n');
            resolve();
          } else {
            reject(new Error(resp.message));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify({
        items: [{ id: 1, title: 'Laskar Pelangi', quantity: 1, price: 69999 }],
        total: 69999
      }));
      req.end();
    });

    // Step 4: Check stock after checkout
    console.log('Step 4: Check stock after checkout...');
    let finalStock = 0;
    await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/products',
        method: 'GET'
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const products = JSON.parse(data);
          const book1 = products.find(p => p.id === 1);
          if (book1) {
            finalStock = book1.stock;
            console.log(`Final stock (ID 1): ${finalStock} units\n`);
          }
          resolve();
        });
      });
      req.on('error', reject);
      req.end();
    });

    // Step 5: Verify
    console.log('=== VERIFICATION ===');
    console.log(`Initial stock: ${initialStock} units`);
    console.log(`Final stock: ${finalStock} units`);
    console.log(`Reduction: ${initialStock - finalStock} units\n`);

    if (finalStock === initialStock - 1) {
      console.log('✅✅✅ BERHASIL! Stock otomatis berkurang 1 unit setar checkout!');
    } else {
      console.log(`❌ Stock tidak berkurang dengan benar (Expected: ${initialStock - 1}, Got: ${finalStock})`);
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testStockReduction();
