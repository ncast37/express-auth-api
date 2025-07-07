const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const apiRoutes = require('./routes/api');
const proxyRoutes = require('./routes/proxy');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Increase header size limits to prevent 431 errors
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Basic logging middleware with header debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Debug headers for auth routes
  if (req.path.includes('/auth/')) {
    console.log('📋 Request headers:', {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'Bearer [TOKEN]' : 'None',
      'content-length': req.headers['content-length'],
      'user-agent': req.headers['user-agent']?.substring(0, 50) + '...'
    });
    console.log('📦 Request body:', req.body);
  }
  
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      proxy: '/proxy',
      auth: '/api/auth'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', apiRoutes);

app.use('/api/auth', authRoutes);

// Proxy routes for 3rd party API calls

app.use('/proxy', proxyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
});

module.exports = app;
