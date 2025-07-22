const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Use the same JWT secret as authController.js
const SECRET_KEY = process.env.JWT_SECRET || 'gursha_jwt_secret_key_2024_very_secure_123456789';

// Middleware to authenticate users
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    console.log('Token verified successfully for user:', decoded.id, 'Role:', decoded.role);
    next();
  });
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  console.log('Checking admin role. User role:', req.userRole);
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Admin Role!' });
  }
  console.log('Admin role verified successfully');
  next();
};

// Middleware to check if the user is a game controller
exports.isGameController = (req, res, next) => {
  if (req.userRole !== 'controller') {
    return res.status(403).json({ message: 'Require Game Controller Role!' });
  }
  next();
};
