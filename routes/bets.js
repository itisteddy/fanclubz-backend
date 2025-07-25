const express = require('express');
const router = express.Router();

// In-memory bet storage (replace with database in production)
let bets = [
  {
    id: '1',
    title: 'Will the next iPhone have a USB-C port?',
    description: 'Apple has been rumored to switch to USB-C for the iPhone 15. What do you think will happen?',
    category: 'Technology',
    creator: {
      id: '1',
      username: 'techbetter',
      firstName: 'Tech',
      lastName: 'Better'
    },
    options: [
      { id: 'yes', label: 'Yes, USB-C', amount: 750, color: '#22c55e' },
      { id: 'no', label: 'No, Lightning', amount: 250, color: '#ef4444' }
    ],
    totalPool: 1000,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: 'active',
    createdAt: new Date().toISOString(),
    participantCount: 42,
    trending: true,
    clubId: null
  },
  {
    id: '2', 
    title: 'Will Taylor Swift release a new album this year?',
    description: 'Taylor Swift has been dropping hints about new music. Will we get a new album in 2025?',
    category: 'Entertainment',
    creator: {
      id: '2',
      username: 'swiftie',
      firstName: 'Swift',
      lastName: 'Fan'
    },
    options: [
      { id: 'yes', label: 'Yes, new album', amount: 600, color: '#22c55e' },
      { id: 'no', label: 'No new album', amount: 400, color: '#ef4444' }
    ],
    totalPool: 1000,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'active',
    createdAt: new Date().toISOString(),
    participantCount: 156,
    trending: true,
    clubId: null
  },
  {
    id: '3',
    title: 'Will Bitcoin reach $100,000 this year?',
    description: 'Bitcoin has been volatile lately. Will it hit the $100k milestone in 2025?',
    category: 'Finance',
    creator: {
      id: '3',
      username: 'cryptoking',
      firstName: 'Crypto',
      lastName: 'King'
    },
    options: [
      { id: 'yes', label: 'Yes, $100k+', amount: 800, color: '#22c55e' },
      { id: 'no', label: 'No, stays below', amount: 200, color: '#ef4444' }
    ],
    totalPool: 1000,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    status: 'active',
    createdAt: new Date().toISOString(),
    participantCount: 89,
    trending: false,
    clubId: null
  }
];

// Get all bets
router.get('/', (req, res) => {
  const { category, status, trending } = req.query;
  
  let filteredBets = [...bets];
  
  if (category) {
    filteredBets = filteredBets.filter(bet => 
      bet.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (status) {
    filteredBets = filteredBets.filter(bet => bet.status === status);
  }
  
  if (trending === 'true') {
    filteredBets = filteredBets.filter(bet => bet.trending);
  }
  
  res.json({
    success: true,
    data: {
      items: filteredBets,
      total: filteredBets.length,
      page: 1,
      limit: 20,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Get trending bets
router.get('/trending', (req, res) => {
  const trendingBets = bets.filter(bet => bet.trending);
  
  res.json({
    success: true,
    data: {
      items: trendingBets,
      total: trendingBets.length,
      page: 1,
      limit: 20,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Get specific bet by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const bet = bets.find(b => b.id === id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      message: 'Bet not found'
    });
  }
  
  res.json({
    success: true,
    data: bet
  });
});

// Get bet comments (placeholder)
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  const bet = bets.find(b => b.id === id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      message: 'Bet not found'
    });
  }
  
  // Sample comments
  const comments = [
    {
      id: '1',
      user: { username: 'commentor1', firstName: 'John', lastName: 'Doe' },
      content: 'I think this is going to happen for sure!',
      createdAt: new Date().toISOString(),
      likes: 5
    },
    {
      id: '2', 
      user: { username: 'commentor2', firstName: 'Jane', lastName: 'Smith' },
      content: 'Not so sure about this one...',
      createdAt: new Date().toISOString(),
      likes: 2
    }
  ];
  
  res.json({
    success: true,
    data: {
      items: comments,
      total: comments.length,
      page: 1,
      limit: 20,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Create new bet (placeholder)
router.post('/', (req, res) => {
  // This would create a new bet
  res.json({
    success: false,
    message: 'Bet creation coming soon!'
  });
});

// Place bet entry (placeholder)
router.post('/:id/entries', (req, res) => {
  // This would place a bet entry
  res.json({
    success: false,
    message: 'Bet placement coming soon!'
  });
});

module.exports = router;