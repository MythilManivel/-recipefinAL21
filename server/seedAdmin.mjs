// seedAdmin.mjs
import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  const email = 'admin@example.com';    // <-- change if you like
  const password = 'Admin@123';         // <-- change to a strong password
  const name = 'Super Admin';

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    // Update to admin + set password (pre-save hook will hash it)
    existing.role = 'admin';
    existing.password = password;
    await existing.save();
    console.log('✅ Updated existing user to admin:', email);
  } else {
    // Create a new admin user (pre-save hook will hash password)
    await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      provider: 'local',
    });
    console.log('✅ Created new admin:', email);
  }

  process.exit(0);
};

run().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
