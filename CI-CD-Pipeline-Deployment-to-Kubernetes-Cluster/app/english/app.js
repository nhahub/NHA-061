// Import required modules
const express = require('express');

// Initialize Express application
const app = express();

// Get port from environment variable or use default 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Health check endpoint - used by load balancers and orchestrators
app.get('/en/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Application is running successfully'
  });
});

// Root endpoint - basic information about the API
app.get('/en/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the CI/CD Test Application',
    version: '1.0.0',
    language: 'English',
    endpoints: {
      health: '/health',
      data: '/api/data',
      status: '/api/status'
    }
  });
});

// Data endpoint - returns sample data for testing
app.get('/en/api/data', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      items: [
        { id: 1, name: 'Item One', description: 'First test item' },
        { id: 2, name: 'Item Two', description: 'Second test item' },
        { id: 3, name: 'Item Three', description: 'Third test item' }
      ],
      count: 3,
      timestamp: new Date().toISOString()
    }
  });
});

// Status endpoint - returns application status
app.get('/en/api/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Welcome to unknown',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`English Application running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Export app for testing purposes
module.exports = app;