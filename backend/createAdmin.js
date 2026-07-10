require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: node createAdmin.js <username> <password>');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ username });
  if (exists) {
    console.error(`❌ User "${username}" already exists`);
    process.exit(1);
  }
  await User.create({ username, password, role: 'admin', status: 'approved' });
  console.log(`✅ Admin "${username}" created successfully`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err.message); process.exit(1); });
