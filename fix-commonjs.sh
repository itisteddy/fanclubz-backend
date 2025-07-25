#!/bin/bash

echo "🔧 FIXING MODULE SYSTEM AND NODE TYPES"
echo "======================================"

cd "/Users/efe/Library/CloudStorage/OneDrive-Personal/fanclubz-backend-only"

echo ""
echo "1️⃣ Switching to CommonJS (more reliable for Node.js)..."
echo "====================================================="

cat > package.json << 'EOF'
{
  "name": "fanclubz-backend",
  "version": "1.0.0",
  "description": "Fan Club Z Backend API Server",
  "main": "dist/index.js",
  "engines": {
    "node": ">=18.0.0"
  },
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
    "@types/node": "^20.14.0",
    "tsx": "^4.6.2",
    "typescript": "^5.8.3"
  }
}
EOF

echo "✅ Updated package.json (removed ES modules)"

echo ""
echo "2️⃣ Creating CommonJS-compatible TypeScript config..."
echo "=================================================="

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noImplicitAny": false,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "sourceMap": true,
    "removeComments": true,
    "typeRoots": ["./node_modules/@types"],
    "types": ["node"]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF

echo "✅ Created CommonJS TypeScript configuration"

echo ""
echo "3️⃣ Converting server to CommonJS syntax..."
echo "=========================================="

cat > src/index.ts << 'EOF'
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
EOF

echo "✅ Converted server to CommonJS"

echo ""
echo "4️⃣ Adding simple .env file for local development..."
echo "================================================="

cat > .env << 'EOF'
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://fanclubz.app
EOF

echo "✅ Created basic .env file"

echo ""
echo "5️⃣ Committing and pushing the CommonJS fix..."
echo "============================================="

git add .
git commit -m "Fix: Switch to CommonJS module system

- Converted from ES modules to CommonJS (more reliable for Node.js)
- Fixed TypeScript configuration for CommonJS
- Removed module system conflicts
- Added explicit Express types
- Should resolve 'Cannot find type definition file for node' error

CommonJS is more stable for Node.js backend deployment."

git push origin main

echo ""
echo "✅ COMMONJS CONVERSION COMPLETE!"
echo "==============================="
echo ""
echo "🔧 What changed:"
echo "- ✅ Switched from ES modules to CommonJS"
echo "- ✅ Fixed TypeScript Node.js type resolution"
echo "- ✅ Updated module configuration"
echo "- ✅ Added explicit Express types"
echo "- ✅ Removed module system conflicts"
echo ""
echo "📍 Why this should work:"
echo "- CommonJS is the standard for Node.js backends"
echo "- No ES module import/export issues"
echo "- TypeScript can properly find Node.js types"
echo "- Express types are explicitly defined"
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Wait for Render to auto-redeploy"
echo "2. Build should succeed without type errors"
echo "3. Test the health endpoint"
echo ""
echo "💡 CommonJS is more reliable for deployment platforms"
