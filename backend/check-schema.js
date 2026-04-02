/**
 * Check Supabase table structure
 */

const { supabase } = require('./db/supabase');

const checkSchema = async () => {
  try {
    console.log('🔍 Checking Supabase schema...\n');

    // Get one product to see all fields
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying products:', error.message);
    } else if (data && data.length > 0) {
      console.log('✅ Sample product from Supabase:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('ℹ️  No products found, getting empty result with schema info');
      // Try with specific fields to see what works
      const { data: emptyData, error: emptyError } = await supabase
        .from('products')
        .select('*')
        .limit(0);
      
      if (emptyError) {
        console.log('Error:', emptyError.message);
      }
    }

    // Try to get table structure by attempting different queries
    console.log('\n🔎 Attempting different column combinations...');
    
    const fieldCombos = [
      ['id', 'title', 'author', 'category', 'price', 'stock', 'image'],
      ['id', 'title', 'author', 'category_id', 'category_name', 'price', 'stock', 'image'],
      ['id', 'title', 'author', 'category', 'price', 'stock', 'image', 'created_at'],
    ];

    for (const fields of fieldCombos) {
      try {
        const { error: testError } = await supabase
          .from('products')
          .select(fields.join(', '))
          .limit(1);
        
        if (!testError) {
          console.log(`✅ Working fields: ${fields.join(', ')}`);
        }
      } catch (e) {
        // Ignore
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

checkSchema();
