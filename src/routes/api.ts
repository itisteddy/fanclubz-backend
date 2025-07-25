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
