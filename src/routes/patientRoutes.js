// backend/src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getPatientById,
  updatePatient
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

// All patient routes are protected
router.use(protect);

router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

module.exports = router;