// backend/src/controllers/patientController.js
const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');

/**
 * @desc    Get patient by ID
 * @route   GET /api/patients/:id
 * @access  Private
 */
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate('nextOfKin');

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  res.status(200).json({
    success: true,
    data: patient
  });
});

/**
 * @desc    Update patient information
 * @route   PUT /api/patients/:id
 * @access  Private
 */
const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const patient = await Patient.findById(id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedPatient
  });
});

module.exports = {
  getPatientById,
  updatePatient
};