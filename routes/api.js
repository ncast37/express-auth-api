const express = require('express');
const router = express.Router();

// Sample API routes
router.get('/', (req, res) => {
  res.json({
    message: 'API Routes',
    availableRoutes: [
      'GET /api/test',
      'POST /api/data',
      'GET /api/status'
    ]
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    query: req.query,
    headers: req.headers
  });
});

// Example POST endpoint
router.post('/data', (req, res) => {
  const { body } = req;
  
  res.json({
    message: 'Data received successfully',
    receivedData: body,
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
router.get('/status', (req, res) => {
  res.json({
    apiStatus: 'operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
