const pool = require('./db/db');

async function addTransactions() {
  try {
    const brinaId = 5; // User brina
    const now = new Date();

    // Insert 3 transactions untuk brina
    const transactions = [
      {
        transaction_code: `ORDER-${Date.now()}-1`,
        items: JSON.stringify([
          { id: 1, title: 'Cerita Rakyat Nusantara', qty: 2, price: 75000 },
          { id: 2, title: 'Si Kancil Penggalau', qty: 1, price: 65000 }
        ]),
        total_amount: 215000,
        status: 'completed',
        payment_method: 'bank_transfer'
      },
      {
        transaction_code: `ORDER-${Date.now()}-2`,
        items: JSON.stringify([
          { id: 3, title: 'Legenda Bukit Merah', qty: 3, price: 80000 }
        ]),
        total_amount: 240000,
        status: 'pending',
        payment_method: 'cash'
      },
      {
        transaction_code: `ORDER-${Date.now()}-3`,
        items: JSON.stringify([
          { id: 4, title: 'Petualangan Anak Negeri', qty: 1, price: 90000 },
          { id: 5, title: 'Dongeng Sebelum Tidur', qty: 2, price: 70000 }
        ]),
        total_amount: 230000,
        status: 'shipped',
        payment_method: 'e_wallet'
      }
    ];

    let inserted = 0;
    for (const txn of transactions) {
      await pool.query(
        `INSERT INTO transactions 
         (user_id, transaction_code, items, total_amount, status, payment_method, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [brinaId, txn.transaction_code, txn.items, txn.total_amount, txn.status, txn.payment_method]
      );
      inserted++;
    }

    console.log(`\n✅ Successfully added ${inserted} transactions for user brina!\n`);

    // Verify
    const result = await pool.query(
      'SELECT transaction_code, total_amount, status FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [brinaId]
    );

    console.log('=== Transactions for Brina ===\n');
    result.rows.forEach(t => {
      console.log(`${t.transaction_code} | ${t.total_amount} | ${t.status}`);
    });
    console.log(`\nTotal: ${result.rows.length} transactions\n`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

addTransactions();
