// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  login, 
  logout, 
  getMe, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

module.exports = router;