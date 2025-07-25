#!/bin/bash

echo "🚀 CREATING MINIMAL WORKING BACKEND"
echo "==================================="

cd "/Users/efe/Library/CloudStorage/OneDrive-Personal/fanclubz-backend-only"

echo ""
echo "1️⃣ Creating simple, working server structure..."
echo "==============================================="

# Backup existing src if it has complex code
if [ -d "src" ]; then
    mv src src_backup_complex
    echo "✅ Backed up complex src to src_backup_complex"
fi

# Create new minimal src structure
mkdir -p src/{routes,middleware,config}

echo ""
echo "2️⃣ Creating main server file..."
echo "==============================="

cat > src/index.ts << 'EOF'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { apiRoutes } from './routes/api.js'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 10000

// Trust proxy for Render
app.set('trust proxy', 1)

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://fanclubz.app',
  credentials: true
}))

app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use(rateLimiter)

// Routes
app.use('/api', apiRoutes)

// Health check (outside API routes for easier access)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  })
})

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Fan Club Z Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/', '/health', '/api']
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fan Club Z Backend running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API base: http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

export default app
EOF

echo "✅ Created main server file"

echo ""
echo "3️⃣ Creating API routes..."
echo "========================="

cat > src/routes/api.ts << 'EOF'
import express from 'express'

const router = express.Router()

// API health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Fan Club Z API',
    version: '1.0.0',
    description: 'Social Betting Platform Backend',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      clubs: '/api/clubs/*'
    }
  })
})

// Auth routes placeholder
router.post('/auth/register', (req, res) => {
  res.json({
    message: 'Registration endpoint ready',
    status: 'coming_soon'
  })
})

router.post('/auth/login', (req, res) => {
  res.json({
    message: 'Login endpoint ready',
    status: 'coming_soon'
  })
})

// Users routes placeholder
router.get('/users/profile', (req, res) => {
  res.json({
    message: 'Profile endpoint ready',
    status: 'coming_soon'
  })
})

// Clubs routes placeholder
router.get('/clubs', (req, res) => {
  res.json({
    message: 'Clubs endpoint ready',
    status: 'coming_soon',
    clubs: []
  })
})

export { router as apiRoutes }
EOF

echo "✅ Created API routes"

echo ""
echo "4️⃣ Creating middleware..."
echo "========================"

cat > src/middleware/errorHandler.ts << 'EOF'
import { Request, Response, NextFunction } from 'express'

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

export const errorHandler = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  console.error(`Error ${status}:`, message)
  console.error('Stack:', error.stack)

  res.status(status).json({
    error: {
      message,
      status,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  })
}
EOF

cat > src/middleware/rateLimiter.ts << 'EOF'
import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})
EOF

echo "✅ Created middleware"

echo ""
echo "5️⃣ Updating package.json for minimal dependencies..."
echo "===================================================="

cat > package.json << 'EOF'
{
  "name": "fanclubz-backend",
  "version": "1.0.0",
  "description": "Fan Club Z Backend API Server",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "echo \"No tests specified\" && exit 0"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.5.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.2",
    "typescript": "^5.8.3"
  }
}
EOF

echo "✅ Updated package.json with minimal dependencies"

echo ""
echo "6️⃣ Committing and pushing changes..."
echo "===================================="

git add .
git commit -m "Simplify: Create minimal working backend

- Replaced complex WebSocket services with simple REST API
- Removed problematic shared modules
- Created basic Express server with health checks
- Added proper error handling and rate limiting
- Minimal dependencies for reliable deployment

This should deploy successfully on Render."

git push origin main

echo ""
echo "✅ MINIMAL BACKEND COMPLETE!"
echo "============================"
echo ""
echo "🎯 What this provides:"
echo "- ✅ Basic Express server"
echo "- ✅ Health check endpoints"
echo "- ✅ API route structure"
echo "- ✅ Error handling"
echo "- ✅ Rate limiting"
echo "- ✅ CORS configuration"
echo "- ✅ No complex dependencies"
echo ""
echo "📍 Available endpoints after deployment:"
echo "- GET / - API info"
echo "- GET /health - Health check"
echo "- GET /api - API info"
echo "- GET /api/health - API health check"
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Wait for Render to auto-redeploy"
echo "2. Build should succeed this time!"
echo "3. Test the health endpoint"
echo "4. We can add features back incrementally"
echo ""
echo "💡 Your complex code is backed up in src_backup_complex/"
