const User = require('../models/User');
const mongoose = require('mongoose');
const {
  findMemoryUserById,
  updateMemoryUser
} = require('../models/memoryStore');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId).select('-password');
        if (user) return res.json(user);
      } catch (err) {
        console.warn('DB lookup failed, trying memory store:', err.message);
      }
    }

    // Fallback to memory store
    const memUser = findMemoryUserById(userId);
    if (memUser) {
      const { password, ...safeUser } = memUser;
      return res.json(safeUser);
    }

    return res.status(404).json({ message: 'User profile not found' });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = { ...req.body };
    
    // Prevent updating password or role through this route
    delete updates.password;
    delete updates.role;
    delete updates._id;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true }
        ).select('-password');
        if (user) return res.json(user);
      } catch (err) {
        console.warn('DB update failed, trying memory store:', err.message);
      }
    }

    // Fallback to memory store
    const updatedMem = updateMemoryUser(userId, updates);
    if (updatedMem) {
      const { password, ...safeUser } = updatedMem;
      return res.json(safeUser);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a PDF or DOCX file.' });
    }
    
    const userId = req.user.userId;
    const resumeUrl = `/uploads/${req.file.filename}`;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { resumeUrl },
          { new: true }
        ).select('-password');
        if (user) {
          return res.json({ message: 'Resume uploaded successfully', resumeUrl, user });
        }
      } catch (err) {
        console.warn('DB resume update failed, trying memory store:', err.message);
      }
    }

    // Fallback to memory store
    const updatedMem = updateMemoryUser(userId, { resumeUrl });
    const { password, ...safeUser } = updatedMem || {};
    res.json({ message: 'Resume uploaded successfully', resumeUrl, user: safeUser });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error while uploading resume' });
  }
};
