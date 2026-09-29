const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-skill-gap';

async function run() {
  await mongoose.connect(MONGO_URI);

  // Delete ALL users
  const result = await User.deleteMany({});
  console.log(`Deleted ${result.deletedCount} existing user(s).`);

  // Create a fresh new user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@123', salt);

  const user = new User({
    fullName: 'Jothi',
    email: 'jothis486@gmail.com',
    password: hashedPassword,
    collegeName: 'IIT Delhi',
    degree: 'B.Tech Computer Science',
    preferredCareer: 'ML Engineer'
  });

  await user.save();
  console.log('\n✅ New account created successfully!');
  console.log('================================');
  console.log('Email:    jothis486@gmail.com');
  console.log('Password: Admin@123');
  console.log('================================');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
