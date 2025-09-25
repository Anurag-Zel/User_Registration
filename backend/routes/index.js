const express = require('express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const userRoutes = require('./user');

const router = express.Router();

// Health check route
router.use('/health', healthRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// User routes
router.use('/user', userRoutes);

module.exports = router;
