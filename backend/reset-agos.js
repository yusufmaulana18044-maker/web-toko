const pool = require('./db/db');

(async () => {
  try {
    // Delete transactions for agos user
    await pool.query('DELETE FROM transactions WHERE user_id = (SELECT id FROM users WHERE username = $1)', ['agos']);
    console.log('✅ Hapus transaksi agos');
    
    // Delete agos user
    await pool.query('DELETE FROM users WHERE username = $1', ['agos']);
    console.log('✅ Hapus user agos yang lama');
    
    // Check remaining users
    const users = await pool.query('SELECT id, username, role FROM users ORDER BY id');
    console.log('\n=== User yang tersisa ===');
    users.rows.forEach(u => console.log(`ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`));
    
    pool.end();
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
