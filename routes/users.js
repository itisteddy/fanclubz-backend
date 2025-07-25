const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// In-memory user storage (replace with database in production)
let users = [];
let nextUserId = 1;

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, dateOfBirth } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !phone || !password || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        details: []
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email.toLowerCase() || u.username === username.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken',
        details: []
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: nextUserId++,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      dateOfBirth,
      createdAt: new Date().toISOString(),
      isVerified: false,
      wallet: {
        balance: 1000, // Starting bonus
        currency: 'USD'
      }
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Return success response (don't send password)
    const { password: _, ...userResponse } = newUser;
    
    console.log(`✅ New user registered: ${email}`);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: userResponse,
      token,
      onboarding: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      details: []
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userResponse } = user;
    
    console.log(`✅ User logged in: ${email}`);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get user profile endpoint
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { password: _, ...userResponse } = user;
  res.json({
    success: true,
    user: userResponse
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  });
}

module.exports = router;