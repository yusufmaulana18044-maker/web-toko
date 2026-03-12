const pool = require('./db/db');

(async () => {
  try {
    // Get user ID for 'user' account
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', ['user']);
    if (userResult.rows.length === 0) {
      console.log('❌ User account not found');
      pool.end();
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log('✅ Found user ID:', userId);
    
    // Sample items
    const items1 = JSON.stringify([{ product_id: 1, title: 'Laskar Pelangi', quantity: 1, price: 85000 }]);
    const items2 = JSON.stringify([{ product_id: 2, title: 'Si Kancil', quantity: 2, price: 65000 }]);
    const items3 = JSON.stringify([{ product_id: 3, title: 'Negeri di Ujung Tanduk', quantity: 1, price: 70000 }]);
    
    // Add first transaction
    await pool.query(
      'INSERT INTO transactions (user_id, transaction_code, total_amount, status, items, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, 'ORDER-001', 85000, 'completed', items1]
    );
    
    // Add second transaction
    await pool.query(
      'INSERT INTO transactions (user_id, transaction_code, total_amount, status, items, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, 'ORDER-002', 130000, 'pending', items2]
    );
    
    // Add third transaction
    const result = await pool.query(
      'INSERT INTO transactions (user_id, transaction_code, total_amount, status, items, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, user_id, transaction_code, total_amount, status',
      [userId, 'ORDER-003', 70000, 'completed', items3]
    );
    
    console.log('✅ Added 3 transactions for user account:');
    console.log('  - ORDER-001: Rp85,000 (completed)');
    console.log('  - ORDER-002: Rp130,000 (pending)');
    console.log('  - ORDER-003: Rp70,000 (completed)');
    
    pool.end();
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
