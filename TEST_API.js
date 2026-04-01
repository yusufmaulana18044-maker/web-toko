/**
 * Test API Products
 * Node.js script untuk test CRUD products
 * Jalankan: node TEST_API.js
 */

const API_BASE = 'http://localhost:5000';

async function test() {
  try {
    console.log('=== TEST API PRODUK ===\n');

    // 1. Login
    console.log('1️⃣ Login sebagai admin...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login berhasil, Token:', token.substring(0, 20) + '...\n');

    // 2. Get semua produk
    console.log('2️⃣ Get semua produk...');
    const productsRes = await fetch(`${API_BASE}/products`);
    const products = await productsRes.json();
    console.log(`✅ Total produk: ${products.length}`);
    if (products.length > 0) {
      console.log('Produk pertama:', JSON.stringify(products[0], null, 2));
    }
    console.log('');

    // 3. Add produk baru
    console.log('3️⃣ Add produk baru...');
    const addRes = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Produk ' + Date.now(),
        author: 'Test Author',
        category: 'Test Category',
        price: 50000,
        stock: 10
      })
    });
    const addData = await addRes.json();
    console.log('Response:', JSON.stringify(addData, null, 2));
    
    if (addData.success) {
      const newProductId = addData.data.id;
      console.log(`✅ Produk berhasil ditambah dengan ID: ${newProductId}\n`);

      // 4. Update produk
      console.log('4️⃣ Update produk yang baru ditambah...');
      const updateRes = await fetch(`${API_BASE}/products/${newProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Produk Updated',
          author: 'Test Author Updated',
          category: 'Test Category Updated',
          price: 75000,
          stock: 20
        })
      });
      const updateData = await updateRes.json();
      console.log('Response:', JSON.stringify(updateData, null, 2));
      console.log(updateData.success ? '✅ Update berhasil\n' : '❌ Update gagal\n');

      // 5. Get produk yang diupdate
      console.log('5️⃣ Get produk setelah update...');
      const getUpdateRes = await fetch(`${API_BASE}/products/${newProductId}`);
      const getUpdateData = await getUpdateRes.json();
      console.log('Produk sekarang:', JSON.stringify(getUpdateData, null, 2));
    } else {
      console.log('❌ Gagal tambah produk\n');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
