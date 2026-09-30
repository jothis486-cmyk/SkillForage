const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, collegeName, degree, preferredCareer } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection is temporarily unavailable. Please verify MONGODB_URI.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
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

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database is currently unreachable. Please check backend MONGODB_URI configuration.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
        degree: user.degree,
        preferredCareer: user.preferredCareer,
        technicalSkills: user.technicalSkills || [],
        programmingLanguages: user.programmingLanguages || [],
        careerReadinessScore: user.careerReadinessScore || 0,
        resumeUrl: user.resumeUrl || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};
