const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy routes for calling 3rd party APIs
router.get('/', (req, res) => {
  res.json({
    message: 'Proxy Routes for 3rd Party API Calls',
    availableRoutes: [
      'GET /proxy/external/:service',
      'POST /proxy/external/:service',
      'GET /proxy/covid/:endpoint?',
      'GET /proxy/jsonplaceholder/:endpoint',
      'GET /proxy/httpbin/:endpoint'
    ],
    examples: [
      '/proxy/covid (US daily data)',
      '/proxy/covid/us-current',
      '/proxy/covid/states',
      '/proxy/covid/states/ca/daily.json',
      '/proxy/jsonplaceholder/posts',
      '/proxy/jsonplaceholder/users',
      '/proxy/httpbin/get'
    ]
  });
});

// Generic external API proxy
router.all('/external/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const { url, ...otherParams } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL parameter is required',
        example: '/proxy/external/myservice?url=https://api.example.com/data'
      });
    }

    const config = {
      method: req.method,
      url: url,
      headers: {
        ...req.headers,
        host: undefined, // Remove host header to avoid conflicts
      },
      params: otherParams,
    };

    // Include body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      config.data = req.body;
    }

    const response = await axios(config);
    
    res.json({
      service: service,
      data: response.data,
      status: response.status,
      headers: response.headers
    });

  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Proxy request failed',
      message: error.message,
      service: req.params.service,
      originalUrl: req.query.url
    });
  }
});

// JSONPlaceholder proxy (for testing)
router.get('/jsonplaceholder/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const baseUrl = 'https://jsonplaceholder.typicode.com';
    
    const response = await axios.get(`${baseUrl}/${endpoint}`, {
      params: req.query
    });
    
    res.json({
      source: 'JSONPlaceholder',
      endpoint: endpoint,
      data: response.data,
      count: Array.isArray(response.data) ? response.data.length : 1
    });

  } catch (error) {
    console.error('JSONPlaceholder proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'JSONPlaceholder request failed',
      message: error.message,
      endpoint: req.params.endpoint
    });
  }
});

// COVID Tracking API proxy
router.get('/covid/:endpoint?', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const baseUrl = 'https://api.covidtracking.com/v2';
    
    // Default to US daily data if no specific endpoint provided
    let apiEndpoint = endpoint || 'us/daily.json';
    
    // Handle common shorthand endpoints
    const endpointMap = {
      'us': 'us/daily.json',
      'us-daily': 'us/daily.json',
      'us-current': 'us/current.json',
      'states': 'states/daily.json',
      'states-current': 'states/current.json',
      'states-info': 'states/info.json'
    };
    
    if (endpointMap[apiEndpoint]) {
      apiEndpoint = endpointMap[apiEndpoint];
    }
    
    const response = await axios.get(`${baseUrl}/${apiEndpoint}`, {
      params: req.query,
      timeout: 10000 // 10 second timeout
    });
    
    res.json({
      source: 'COVID Tracking Project',
      endpoint: apiEndpoint,
      requestedEndpoint: endpoint || 'default',
      data: response.data,
      count: Array.isArray(response.data?.data) ? response.data.data.length : 1,
      lastUpdated: response.data?.meta?.build_time || 'Unknown',
      note: 'Historical data only - COVID Tracking Project ended March 2021'
    });

  } catch (error) {
    console.error('COVID Tracking API error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'COVID Tracking API request failed',
      message: error.message,
      endpoint: req.params.endpoint || 'us/daily.json',
      availableEndpoints: {
        shortcuts: {
          'us': 'US daily historical data',
          'us-current': 'US current/latest data', 
          'states': 'All states daily data',
          'states-current': 'All states current data'
        },
        examples: [
          '/proxy/covid/us',
          '/proxy/covid/us-current',
          '/proxy/covid/states/ca/daily.json',
          '/proxy/covid/us/daily.json?date=2021-03-07'
        ]
      },
      note: 'The COVID Tracking Project has ended data collection. Historical data may still be available.'
    });
  }
});

// HTTPBin proxy (for testing HTTP methods)
router.all('/httpbin/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const baseUrl = 'https://httpbin.org';
    
    const config = {
      method: req.method,
      url: `${baseUrl}/${endpoint}`,
      params: req.query,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      config.data = req.body;
    }

    const response = await axios(config);
    
    res.json({
      source: 'HTTPBin',
      endpoint: endpoint,
      method: req.method,
      data: response.data
    });

  } catch (error) {
    console.error('HTTPBin proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'HTTPBin request failed',
      message: error.message,
      endpoint: req.params.endpoint
    });
  }
});

module.exports = router;
