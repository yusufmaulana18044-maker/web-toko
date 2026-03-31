/**
 * Supabase Client Configuration
 * Dokumentasi: https://supabase.com/docs/reference/javascript/introduction
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: SUPABASE_URL dan SUPABASE_ANON_KEY harus diset di .env');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Verificate connection
 */
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact', head: true });

    if (error) {
      console.error('⚠️  Peringatan: Koneksi Supabase mungkin tidak optimal');
      console.error('Error:', error.message);
      return false;
    }

    console.log('✅ Koneksi Supabase berhasil!');
    return true;
  } catch (err) {
    console.error('❌ Error saat test koneksi:', err.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
