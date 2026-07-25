const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('\n=== Environment Check ===\n');

console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set (' + process.env.JWT_SECRET.substring(0, 10) + '...)' : '✗ MISSING');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE ? '✓ Set (' + process.env.JWT_EXPIRE + ')' : '✗ MISSING (will use default: 7d)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ MISSING');
console.log('PORT:', process.env.PORT || '5000 (default)');

if (!process.env.JWT_SECRET) {
  console.log('\n❌ ERROR: JWT_SECRET is not set!');
  console.log('\nPlease create or edit backend/.env and add:');
  console.log('JWT_SECRET=your_secret_key_here');
  console.log('\nYou can generate one with:');
  console.log('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
} else {
  console.log('\n✓ All critical environment variables are set correctly!\n');
}