const http = require('http');

// Test API untuk admin akses transaksi
const testAdminTransactions = async () => {
  try {
    // Langkah 1: Login sebagai admin
    console.log('=== LOGIN AS ADMIN ===\n');
    
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
          try {
            const response = JSON.parse(data);
            if (response.success) {
              console.log('✅ Login berhasil');
              console.log('Token:', response.token.substring(0, 20) + '...\n');
              resolve(response.token);
            } else {
              reject(new Error(response.message));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }));
      req.end();
    });

    // Langkah 2: GET semua transaksi dengan admin token
    console.log('=== GET ALL TRANSACTIONS AS ADMIN ===\n');

    const transactionOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/transactions',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    };

    await new Promise((resolve, reject) => {
      const req = http.request(transactionOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              console.log('✅ Admin bisa akses transaksi!');
              console.log(`Total transaksi: ${response.data.length}`);
              if (response.data.length > 0) {
                console.log('\nSample transaksi:');
                console.log('- ID:', response.data[0].id);
                console.log('- Code:', response.data[0].transaction_code);
                console.log('- Total:', response.data[0].total_amount);
              }
            } else {
              console.log('❌ Error:', response.message);
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log('\n✅ Test selesai - Admin access berhasil!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdminTransactions();
