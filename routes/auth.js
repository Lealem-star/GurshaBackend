// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Test Route
router.get('/test', authController.test);

// Sign Up Route
router.post('/signup', authController.signup);

// Sign In Route
router.post('/signin', authController.signin);

module.exports = router;
