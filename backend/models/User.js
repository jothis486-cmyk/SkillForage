const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phoneNumber: { type: String },
  collegeName: { type: String },
  degree: { type: String },
  department: { type: String },
  cgpa: { type: Number },
  graduationYear: { type: Number },
  technicalSkills: [{ type: String }],
  programmingLanguages: [{ type: String }],
  preferredCareer: { type: String },
  resumeUrl: { type: String },
  careerReadinessScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
