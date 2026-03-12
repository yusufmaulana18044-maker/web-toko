const pool = require('./db/db');

async function checkTransactions() {
  try {
    // Get all transactions
    const result = await pool.query(
      `SELECT t.id, t.user_id, t.transaction_code, t.total_amount, t.status, 
              u.username, u.id as user_id
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`
    );

    console.log('\n=== All Transactions in Database ===\n');
    if (result.rows.length === 0) {
      console.log('❌ No transactions found!');
    } else {
      result.rows.forEach(t => {
        console.log(`ID: ${t.id} | Code: ${t.transaction_code} | User: ${t.username} (ID: ${t.user_id}) | Amount: ${t.total_amount} | Status: ${t.status}`);
      });
    }
    console.log(`\nTotal: ${result.rows.length} transactions\n`);

    // Get transactions for user brina (ID 5)
    console.log('\n=== Transactions for User "brina" (ID: 5) ===\n');
    const brinaResult = await pool.query(
      'SELECT id, transaction_code, total_amount, status, created_at FROM transactions WHERE user_id = 5'
    );
    
    if (brinaResult.rows.length === 0) {
      console.log('❌ Brina has NO transactions!');
    } else {
      brinaResult.rows.forEach(t => {
        console.log(`${t.transaction_code} | Amount: ${t.total_amount} | Status: ${t.status} | Created: ${t.created_at}`);
      });
    }
    console.log(`Total for brina: ${brinaResult.rows.length} transactions\n`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkTransactions();
