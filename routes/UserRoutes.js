const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// User routes
router.post('/users', userController.createUser); // Create a new user
router.get('/users', userController.getUsers); // Get all users
router.get('/users/:id', userController.getUserById); // Get user by ID
router.put('/users/:userId', userController.updateUser); // Update a user
router.delete('/users/:userId', userController.deleteUser); // Delete a user

module.exports = router;
