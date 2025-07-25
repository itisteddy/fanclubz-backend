import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

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
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Fan Club Z Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API routes
app.get('/api', (req: express.Request, res: express.Response) => {
  res.json({
    name: 'Fan Club Z API',
    version: '1.0.0',
    description: 'Social Betting Platform Backend',
    endpoints: {
      health: '/api/health',
      info: '/api'
    }
  });
});

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple auth endpoints
app.post('/api/auth/register', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Registration endpoint ready',
    status: 'coming_soon'
  });
});

app.post('/api/auth/login', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Login endpoint ready',
    status: 'coming_soon'
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/', '/health', '/api']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fan Club Z Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Export for testing
module.exports = app;
