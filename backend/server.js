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

// ─── CORS Configuration ────────────────────────────────────────────────────────
// Build allowed origins list from env + localhost defaults
const buildAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
  ]);

  // Add any FRONTEND_URL values (supports comma-separated list)
  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL
      .split(',')
      .map(s => s.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach(u => origins.add(u));
  }

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl / Postman (no Origin header)
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/$/, '');

    // 1. Exact match in allowed list
    if (allowedOrigins.has(normalized)) {
      return callback(null, true);
    }

    // 2. Always allow *.onrender.com (both frontend and backend are on Render)
    if (normalized.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    // 3. Always allow localhost in any port (dev convenience)
    if (normalized.startsWith('http://localhost:') || normalized.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // 4. Allow vercel.app and netlify.app deployments
    if (normalized.endsWith('.vercel.app') || normalized.endsWith('.netlify.app')) {
      return callback(null, true);
    }

    // 5. Reject everything else
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS: Origin ${origin} is not allowed`));
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

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');
const interviewRoutes = require('./routes/interview');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    message: 'SkillForge AI Backend is running',
    database: dbStatus,
    mongoConfigured: !!( process.env.MONGODB_URI || process.env.MONGO_URI ),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('AI Skill Gap Detection API is running...');
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('App Error:', err.message);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: err.message });
  }
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (err.message || 'Server error')
  });
});

// ─── Database Connection ──────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is not set — database features will be unavailable.');
  console.warn('    Set MONGODB_URI in your Render environment variables to enable auth.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillForge AI backend running on port ${PORT}`);
  console.log(`   Allowed origins include: *.onrender.com, *.vercel.app, localhost`);
});
