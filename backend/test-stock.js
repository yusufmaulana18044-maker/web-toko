const jwt = require('jsonwebtoken');

const testStockFeature = async () => {
  try {
    // Test 1: Get all products dengan stock
    console.log('=== TEST 1: GET ALL PRODUCTS ===\n');
    const resp1 = await fetch('http://localhost:5000/products');
    const products = await resp1.json();
    console.log('Jumlah produk:', products.length);
    if (products.length > 0) {
      console.log('Sample product dengan stock:');
      console.log({
        id: products[0].id,
        title: products[0].title,
        price: products[0].price,
        stock: products[0].stock
      });
    }

    // Test 2: Update product dengan stock (admin)
    console.log('\n=== TEST 2: UPDATE PRODUCT (ADD STOCK) ===\n');
    const token = jwt.sign(
      { id: 1, username: 'admin', role: 'admin' },
      'rahasia_jwt',
      { expiresIn: '24h' }
    );

    const resp2 = await fetch('http://localhost:5000/products/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: products[0].title,
        author: products[0].author,
        category: products[0].category,
        price: products[0].price,
        stock: 99
      })
    });

    if (resp2.ok) {
      const updated = await resp2.json();
      console.log('✅ Update berhasil!');
      console.log('Stock updated:', updated.data.stock);
    } else {
      console.log('❌ Update gagal');
    }

    // Test 3: Get product yang sudah diupdate
    console.log('\n=== TEST 3: GET UPDATED PRODUCT ===\n');
    const resp3 = await fetch('http://localhost:5000/products');
    const updatedProducts = await resp3.json();
    const updatedProduct = updatedProducts.find(p => p.id === 1);
    console.log('Product 1 stock:', updatedProduct?.stock);

  } catch(e) {
    console.error('ERROR:', e.message);
  }
};

testStockFeature();
