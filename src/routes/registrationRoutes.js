// backend/src/routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  sendRegistrationLink, 
  verifyRegistrationToken, 
  submitRegistration, 
  submitRegistrationWithToken,
  getRegistrationByCode, 
  getPatientByVerificationCode,
  markRegistrationCodeAsUsed 
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/send-link', sendRegistrationLink);
router.get('/verify/:token', verifyRegistrationToken);
router.post('/', submitRegistration);
router.post('/submit-with-token', submitRegistrationWithToken);

// Protected routes (requires authentication)
router.get('/verify-code/:code', protect, getPatientByVerificationCode);
router.get('/:code', protect, getRegistrationByCode);
router.put('/:code/use', protect, markRegistrationCodeAsUsed);

module.exports = router;