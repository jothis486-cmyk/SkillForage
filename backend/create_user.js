const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-skill-gap';

async function run() {
  await mongoose.connect(MONGO_URI);
  
  await User.deleteOne({ email: 'test@example.com' });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const user = new User({
    fullName: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    collegeName: 'Test University',
    degree: 'B.S. Computer Science',
    preferredCareer: 'ML Engineer'
  });
  
  await user.save();
  console.log('Test user created successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
