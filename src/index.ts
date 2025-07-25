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
