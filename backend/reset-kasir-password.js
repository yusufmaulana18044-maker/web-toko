const bcrypt = require('bcryptjs');
const { supabase } = require('./db/supabase');

const resetKasirPassword = async () => {
  try {
    const username = 'kasir';
    const newPassword = 'kasir123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('🔐 Resetting kasir password in Supabase...');
    
    // Update password
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('username', username)
      .select();
    
    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
    
    if (data && data.length > 0) {
      console.log('\n✅ Password Reset Successfully!');
      console.log(`Username: ${data[0].username}`);
      console.log(`Email: ${data[0].email}`);
      console.log(`Role: ${data[0].role}`);
      console.log(`New Password: ${newPassword}`);
      console.log('\n🚀 Silahkan login dengan password baru!\n');
    } else {
      console.log('❌ User kasir not found!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

resetKasirPassword();
