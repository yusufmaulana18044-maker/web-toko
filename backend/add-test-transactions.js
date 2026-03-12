const pool = require('./db/db');

(async () => {
  try {
    const items1 = JSON.stringify([
      { product_id: 1, title: 'Buku A', price: 75000, quantity: 2 }
    ]);
    const items2 = JSON.stringify([
      { product_id: 2, title: 'Buku B', price: 100000, quantity: 2 }
    ]);
    const items3 = JSON.stringify([
      { product_id: 3, title: 'Buku C', price: 175000, quantity: 1 }
    ]);
    
    const result = await pool.query(
      'INSERT INTO transactions (user_id, transaction_code, total_amount, status, items, created_at) VALUES ($1, $2, $3, $4, $5, NOW()), ($1, $6, $7, $8, $9, NOW()), ($1, $10, $11, $12, $13, NOW()) RETURNING id, user_id, transaction_code, total_amount, status',
      [4, 'ORDER-TEST-001', 150000, 'completed', items1, 'ORDER-TEST-002', 200000, 'pending', items2, 'ORDER-TEST-003', 175000, 'completed', items3]
    );
    
    console.log('✅ Test transactions added for agos user:');
    console.log(result.rows);
    
    pool.end();
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
