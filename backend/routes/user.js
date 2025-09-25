const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { updateProfileValidation } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfileValidation, handleValidationErrors, updateProfile);

module.exports = router;
