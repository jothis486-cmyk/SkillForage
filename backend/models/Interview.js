const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['technical', 'coding', 'hr', 'behavioral', 'project', 'resume', 'aptitude', 'system_design'], required: true },
  category: { type: String },
  questionText: { type: String, required: true },
  codeStub: { type: String },
  language: { type: String, default: 'javascript' },
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String },
    hidden: { type: Boolean, default: false }
  }],
  starPrompts: {
    situation: { type: String },
    task: { type: String },
    action: { type: String },
    result: { type: String }
  },
  userAnswer: { type: String, default: '' },
  userCode: { type: String, default: '' },
  codeResult: {
    passed: { type: Boolean },
    passCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    executionTime: { type: String },
    memoryUsed: { type: String },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
    codeQuality: { type: String },
    outputLog: { type: String }
  },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' }
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  interviewType: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  questions: [questionSchema],
  scores: {
    technical: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    projectKnowledge: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
    placementReadiness: { type: Number, default: 0 },
    careerReadiness: { type: Number, default: 0 }
  },
  evaluation: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{ type: String }],
    topicsToRevise: [{ type: String }],
    recommendedCourses: [{ type: String }],
    recommendedProjects: [{ type: String }],
    interviewTips: [{ type: String }],
    expectedLevel: { type: String },
    summary: { type: String }
  },
  certificateEligible: { type: Boolean, default: false },
  certificateId: { type: String },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
