const express = require('express');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Recruitment Platform API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
