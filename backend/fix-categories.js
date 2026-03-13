const pool = require('./db/db');

const fixCategories = async () => {
  try {
    console.log('=== FIX CATEGORIES WITH SPACES ===\n');
    
    // Fix "Dongeng "
    await pool.query(
      "UPDATE products SET category = 'Dongeng' WHERE category = 'Dongeng '"
    );
    console.log('✅ Fixed "Dongeng "');

    // Fix "Fantasi "
    await pool.query(
      "UPDATE products SET category = 'Fantasi' WHERE category = 'Fantasi '"
    );
    console.log('✅ Fixed "Fantasi "');

    // Fix "Legenda "
    await pool.query(
      "UPDATE products SET category = 'Legenda' WHERE category = 'Legenda '"
    );
    console.log('✅ Fixed "Legenda "');

    // Tambahan: normalisasi kategori agar sesuai frontend
    const categoryMap = {
      "Cerita Rakyat": "Cerita Rakyat",
      "Fabel": "Fabel",
      "Legenda": "Legenda",
      "Petualangan": "Petualangan",
      "Dongeng": "Dongeng",
      "Fantasi": "Fantasi",
      "Sejarah": "Sejarah",
      "Mitos": "Mitos",
      "Sastra Anak": "Cerita Rakyat",
      "Fabel Anak": "Fabel",
      "Fantasi Anak": "Fantasi",
      "Dongeng Klasik": "Dongeng",
      "Legenda Indonesia": "Legenda",
      "Antologi": "Dongeng",
      "Kompilasi": "Dongeng",
      "Kisah Inspiratif": "Petualangan",
      "Aktivitas": "Petualangan"
    };

    const normalizeCategories = async () => {
      try {
        const res = await pool.query("SELECT id, category FROM products");
        for (const row of res.rows) {
          const newCat = categoryMap[row.category] || row.category;
          if (newCat !== row.category) {
            await pool.query("UPDATE products SET category = $1 WHERE id = $2", [newCat, row.id]);
            console.log(`Produk ID ${row.id}: kategori '${row.category}' diubah jadi '${newCat}'`);
          }
        }
        console.log("✅ Normalisasi kategori selesai!");
      } catch (err) {
        console.error("❌ Error:", err.message);
      }
    };

    // Panggil normalisasi sebelum exit
    normalizeCategories().then(() => process.exit(0));
    console.log('\n✅ Semua kategori sudah rapi! Filter akan berfungsi dengan baik!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixCategories();
