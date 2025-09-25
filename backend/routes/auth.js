const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Registration endpoint
router.post('/register', registerValidation, handleValidationErrors, register);

// Login endpoint
router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;
