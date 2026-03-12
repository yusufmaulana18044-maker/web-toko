const bcrypt = require('bcryptjs');
const pool = require('./db/db');

const newPassword = 'brina123';

bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }

  try {
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING username, email',
      [hashedPassword, 'brina']
    );

    if (result.rows.length === 0) {
      console.log('User brina not found!');
    } else {
      console.log('\n✅ Password Updated Successfully!');
      console.log(`Username: ${result.rows[0].username}`);
      console.log(`Email: ${result.rows[0].email}`);
      console.log(`New Password: ${newPassword}`);
      console.log('\nSilahkan login dengan password baru!\n');
    }
    process.exit(0);
  } catch (err) {
    console.error('Database error:', err.message);
    process.exit(1);
  }
});
