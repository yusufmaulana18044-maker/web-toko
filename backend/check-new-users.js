const pool = require('./db/db');

pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC', (err, res) => {
  if (err) { 
    console.error('Error:', err.message); 
    process.exit(1); 
  }
  
  console.log('\n=== All Users in Database ===\n');
  if (res.rows.length === 0) {
    console.log('No users found!');
  } else {
    res.rows.forEach(u => {
      console.log(`ID: ${u.id} | Username: ${u.username} | Email: ${u.email} | Role: ${u.role} | Created: ${u.created_at}`);
    });
  }
  console.log(`\nTotal: ${res.rows.length} users\n`);
  process.exit(0);
});
