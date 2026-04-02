/**
 * Keep only top 10 products
 */

const { supabase } = require('./db/supabase');

const keepTop10 = async () => {
  try {
    console.log('🗑️  Deleting products beyond ID 10...\n');

    const { data, error } = await supabase
      .from('products')
      .delete()
      .gt('id', 10);

    if (error) {
      console.error('❌ Error deleting products:', error.message);
      process.exit(1);
    }

    console.log('✅ Keeping only 10 products!');
    
    // Verify
    const { data: remaining, error: checkError } = await supabase
      .from('products')
      .select('id, title')
      .order('id', { ascending: true });

    if (checkError) {
      console.error('❌ Error verifying:', checkError.message);
    } else {
      console.log(`\n📚 Remaining products: ${remaining.length}`);
      remaining.forEach(p => console.log(`  ${p.id}. ${p.title}`));
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

keepTop10();
