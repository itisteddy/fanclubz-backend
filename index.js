const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Trust proxy for Render
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://fanclubz.app',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    message: 'Fan Club Z Backend is running!'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Fan Club Z Backend API',
    version: '1.0.0',
    status: 'running',
    language: 'JavaScript',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    name: 'Fan Club Z API',
    version: '1.0.0',
    description: 'Social Betting Platform Backend',
    language: 'Pure JavaScript',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      info: '/api'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is working perfectly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Simple auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'Registration endpoint ready',
    status: 'coming_soon',
    body: req.body
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login endpoint ready',
    status: 'coming_soon',
    body: req.body
  });
});

// Users endpoint
app.get('/api/users/profile', (req, res) => {
  res.json({
    message: 'Profile endpoint ready',
    status: 'coming_soon'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableRoutes: ['/', '/health', '/api', '/api/health']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fan Club Z Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`✅ Pure JavaScript - No TypeScript issues!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
