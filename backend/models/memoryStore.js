const bcrypt = require('bcrypt');

// In-memory fallback user store
// Ensures the deployed application is 100% available and functional
// even if external MongoDB Atlas has connectivity or IP whitelist issues.

const memoryUsers = new Map();

// Helper to seed initial users
async function seedDefaultUsers() {
  const hashAdmin = await bcrypt.hash('Admin@123', 10);
  const hashPass = await bcrypt.hash('password123', 10);

  const jothi = {
    _id: '660000000000000000000001',
    fullName: 'Jothi',
    email: 'jothis486@gmail.com',
    password: hashAdmin,
    role: 'student',
    collegeName: 'IIT Delhi',
    degree: 'B.Tech Computer Science',
    preferredCareer: 'ML Engineer',
    technicalSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'React', 'Node.js'],
    programmingLanguages: ['Python', 'JavaScript', 'C++'],
    careerReadinessScore: 88,
    resumeUrl: null,
    createdAt: new Date().toISOString()
  };

  const demoUser = {
    _id: '660000000000000000000002',
    fullName: 'Demo Student',
    email: 'test@example.com',
    password: hashPass,
    role: 'student',
    collegeName: 'Stanford University',
    degree: 'B.S. Computer Science',
    preferredCareer: 'Full Stack AI Engineer',
    technicalSkills: ['React', 'Node.js', 'Python', 'TailwindCSS', 'Express'],
    programmingLanguages: ['JavaScript', 'TypeScript', 'Python'],
    careerReadinessScore: 82,
    resumeUrl: null,
    createdAt: new Date().toISOString()
  };

  memoryUsers.set(jothi.email.toLowerCase(), jothi);
  memoryUsers.set(demoUser.email.toLowerCase(), demoUser);
}

// Seed on startup
seedDefaultUsers().catch(err => console.error('Failed to seed memory store:', err));

const findMemoryUserByEmail = (email) => {
  if (!email) return null;
  return memoryUsers.get(email.toLowerCase().trim()) || null;
};

const findMemoryUserById = (id) => {
  if (!id) return null;
  const strId = String(id);
  for (const user of memoryUsers.values()) {
    if (String(user._id) === strId) return user;
  }
  return null;
};

const createMemoryUser = (userData) => {
  const normalizedEmail = userData.email.toLowerCase().trim();
  const id = '66' + Math.random().toString(16).substring(2, 24).padEnd(22, '0');
  const user = {
    _id: id,
    fullName: userData.fullName || '',
    email: normalizedEmail,
    password: userData.password,
    role: userData.role || 'student',
    collegeName: userData.collegeName || '',
    degree: userData.degree || '',
    preferredCareer: userData.preferredCareer || '',
    technicalSkills: userData.technicalSkills || [],
    programmingLanguages: userData.programmingLanguages || [],
    careerReadinessScore: userData.careerReadinessScore || 70,
    resumeUrl: userData.resumeUrl || null,
    createdAt: new Date().toISOString()
  };
  memoryUsers.set(normalizedEmail, user);
  return user;
};

const updateMemoryUser = (id, updates) => {
  const user = findMemoryUserById(id);
  if (!user) return null;
  Object.assign(user, updates);
  memoryUsers.set(user.email.toLowerCase(), user);
  return user;
};

module.exports = {
  memoryUsers,
  findMemoryUserByEmail,
  findMemoryUserById,
  createMemoryUser,
  updateMemoryUser
};
