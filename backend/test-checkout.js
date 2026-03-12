const jwt = require('jsonwebtoken');

// Need to use built-in fetch in Node 18+
const testCheckout = async () => {
  try {
    // Generate token untuk user
    const token = jwt.sign(
      { id: 3, username: 'user', role: 'user' },
      'rahasia_jwt',
      { expiresIn: '24h' }
    );

    // Test checkout endpoint
    const response = await fetch('http://localhost:5000/transactions/user/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          { id: 1, title: "Test Buku", price: 50000, quantity: 1 }
        ],
        total: 50000
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('ERROR:', e.message);
  }
};

testCheckout();
