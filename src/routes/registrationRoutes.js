// backend/src/routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  sendRegistrationLink, 
  verifyRegistrationToken, 
  submitRegistration, 
  getRegistrationByCode, 
  markRegistrationCodeAsUsed 
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/send-link', sendRegistrationLink);
router.get('/verify/:token', verifyRegistrationToken);
router.post('/', submitRegistration);

// Protected routes (requires authentication)
router.get('/:code', protect, getRegistrationByCode);
router.put('/:code/use', protect, markRegistrationCodeAsUsed);

module.exports = router;