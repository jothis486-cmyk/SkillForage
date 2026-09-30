const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
].filter(Boolean);

const parsedOrigins = allowedOrigins.flatMap(item => 
  item.split(',').map(s => s.trim().replace(/\/$/, ''))
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');

    // Allow if FRONTEND_URL is wildcard, not set (for initial onboarding), or match found
    if (parsedOrigins.length === 0 || parsedOrigins.includes('*') || parsedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // In development mode, allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && normalizedOrigin.includes('localhost')) {
      return callback(null, true);
    }

    // Production check
    return callback(new Error(`CORS Error: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');
const interviewRoutes = require('./routes/interview');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint (TASK 10)
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    message: 'SkillForge AI Backend is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Root route (Preserved)
app.get('/', (req, res) => {
  res.send('AI Skill Gap Detection API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.message);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: err.message });
  }
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : (err.message || 'Server error')
  });
});

// Database Connection (TASK 8)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI is not set in environment variables. Database features will be unavailable until MONGODB_URI is configured.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected successfully'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.error('Please verify your MONGODB_URI connection string and network access.');
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillForge Backend running on port ${PORT}`);
});
