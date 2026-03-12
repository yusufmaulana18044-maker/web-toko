const pool = require('./backend/db/db');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

(async () => {
  try {
    console.log('=== TEST TRANSACTIONS API ===\n');
    
    // 1. Ambil user dan token
    const users = await pool.query('SELECT id, username, role FROM users WHERE username = $1', ['user']);
    const targetUser = users.rows[0];
    console.log('User:', targetUser);
    
    // 2. Generate token
    const token = jwt.sign(
      { id: targetUser.id, username: targetUser.username, role: targetUser.role },
      'rahasia_jwt',
      { expiresIn: '24h' }
    );
    console.log('Token generated:', token.substring(0, 50) + '...\n');
    
    // 3. Test database query
    const trans = await pool.query(
      'SELECT id, transaction_code, total_amount, status, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [targetUser.id]
    );
    console.log('Database Query Result:');
    console.log('Count:', trans.rows.length);
    console.log('Data:', JSON.stringify(trans.rows, null, 2));
    
    // 4. Test API call
    console.log('\n\n=== API CALL TEST ===');
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response Status: OK');
      console.log('Response Body:', JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.log('API Response Status:', response.status);
      console.log('Error:', error);
    }
    
    process.exit(0);
  } catch(e) {
    console.error('ERROR:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
