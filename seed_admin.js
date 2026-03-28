const bcrypt = require('bcryptjs');
const pool = require('./backend/config/database'); // Update path if needed

async function seed() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 12);
  console.log('Admin hash:', hash);
  // Run on Render DB: UPDATE users SET password = 'HASH' WHERE email = 'admin@iw.com';
}

seed().catch(console.error);

