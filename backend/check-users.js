const pool = require('./db/db');

(async () => {
  try {
    const users = await pool.query('SELECT id, username, email, role FROM users ORDER BY id');
    console.log('\n=== SEMUA USER ===');
    users.rows.forEach(u => console.log(`ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`));
    
    const trans = await pool.query('SELECT id, user_id, transaction_code, total_amount, status FROM transactions ORDER BY created_at DESC');
    console.log('\n=== SEMUA TRANSAKSI ===');
    if (trans.rows.length === 0) {
      console.log('Tidak ada transaksi');
    } else {
      trans.rows.forEach(t => console.log(`ID: ${t.id}, User: ${t.user_id}, Code: ${t.transaction_code}, Rp${t.total_amount}, Status: ${t.status}`));
    }
    
    pool.end();
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
