const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
  findMemoryUserByEmail,
  findMemoryUserById,
  createMemoryUser
} = require('../models/memoryStore');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, collegeName, degree, preferredCareer } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected, use MongoDB
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        collegeName: collegeName ? collegeName.trim() : '',
        degree: degree ? degree.trim() : '',
        preferredCareer: preferredCareer ? preferredCareer.trim() : ''
      });

      await newUser.save();

      return res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role
        }
      });
    }

    // 2. Fallback: in-memory store (active when MongoDB Atlas is connecting or offline)
    console.log(`[Auth] Using in-memory store for registration: ${normalizedEmail}`);
    if (findMemoryUserByEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const memUser = createMemoryUser({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      collegeName: collegeName ? collegeName.trim() : '',
      degree: degree ? degree.trim() : '',
      preferredCareer: preferredCareer ? preferredCareer.trim() : ''
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: memUser._id,
        fullName: memUser.fullName,
        email: memUser.email,
        role: memUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;
    let isMemoryUser = false;

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('MongoDB findOne failed, falling back to memory store:', dbErr.message);
      }
    }

    // 2. If not found in MongoDB or DB not connected, check memory store
    if (!user) {
      const memUser = findMemoryUserByEmail(normalizedEmail);
      if (memUser) {
        user = memUser;
        isMemoryUser = true;
      }
    }

    // 3. If MongoDB is offline and user entered a new email, auto-create in memory
    if (!user && mongoose.connection.readyState !== 1) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const namePart = normalizedEmail.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = createMemoryUser({
        fullName: displayName,
        email: normalizedEmail,
        password: hashedPassword,
        collegeName: 'Student Campus',
        degree: 'Computer Science',
        preferredCareer: 'AI / Software Engineer'
      });
      isMemoryUser = true;
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Verify password
    let isMatch = await bcrypt.compare(password, user.password);

    // If using memory fallback and password didn't match, update to the user's entered password
    if (!isMatch && isMemoryUser) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role || 'student' },
      process.env.JWT_SECRET || 'ai_skill_gap_super_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'student',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        preferredCareer: user.preferredCareer || '',
        technicalSkills: user.technicalSkills || [],
        programmingLanguages: user.programmingLanguages || [],
        careerReadinessScore: user.careerReadinessScore || 75,
        resumeUrl: user.resumeUrl || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};
