const jwt = require('jsonwebtoken');

const testTransactionDetail = async () => {
  try {
    // Generate token untuk user
    const token = jwt.sign(
      { id: 3, username: 'user', role: 'user' },
      'rahasia_jwt',
      { expiresIn: '24h' }
    );

    console.log('=== TEST GET TRANSACTION DETAIL ===\n');

    // Test get transaction detail (ID 5 - dari transaksi sebelumnya)
    const response = await fetch('http://localhost:5000/transactions/5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('ERROR:', e.message);
  }
};

testTransactionDetail();
