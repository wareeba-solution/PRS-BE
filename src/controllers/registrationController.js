// backend/src/controllers/registrationController.js
const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const NextOfKin = require('../models/NextOfKin');
const RegistrationCode = require('../models/RegistrationCode');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

/**
 * @desc    Send registration link to patient via email or SMS
 * @route   POST /api/registration/send-link
 * @access  Public
 */
const sendRegistrationLink = asyncHandler(async (req, res) => {
  const { contactMethod, contactValue } = req.body;

  if (!contactMethod || !contactValue) {
    res.status(400);
    throw new Error('Please provide contact method and value');
  }

  // Generate a unique token for the registration link
  const token = require('crypto').randomBytes(32).toString('hex');

  // Construct a proper registration link
  const registrationLink = `${process.env.FRONTEND_URL}/register/${encodeURIComponent(token)}`;

  // Log the link to the terminal for development
  console.log(`📩 Registration link for patient: ${registrationLink}`);

  // Store the token in the database with expiry (24 hours)
  await RegistrationCode.create({
    code: token,
    patientData: {},
    isUsed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  // Send the link based on contact method
  if (contactMethod === 'email') {
    await emailService.sendRegistrationLink(contactValue, registrationLink);
  } else if (contactMethod === 'sms') {
    await smsService.sendRegistrationLink(contactValue, registrationLink);
  } else {
    res.status(400);
    throw new Error('Invalid contact method');
  }

  res.status(200).json({
    success: true,
    message: `Registration link sent to patient via ${contactMethod}`
  });
});

/**
 * @desc    Verify registration token
 * @route   GET /api/registration/verify/:token
 * @access  Public
 */
const verifyRegistrationToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const registrationCode = await RegistrationCode.findOne({
    code: token,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!registrationCode) {
    res.status(400);
    throw new Error('Invalid or expired registration link');
  }

  res.status(200).json({
    success: true,
    message: 'Registration link is valid'
  });
});

/**
 * @desc    Submit patient registration
 * @route   POST /api/registration
 * @access  Public
 */
const submitRegistration = asyncHandler(async (req, res) => {
  const { patient, nextOfKin } = req.body;

  // Validate input data
  if (!patient || !nextOfKin) {
    res.status(400);
    throw new Error('Please provide both patient and next of kin information');
  }

  // Create next of kin record
  const createdNextOfKin = await NextOfKin.create(nextOfKin);

  // Create patient record with reference to next of kin
  const patientData = {
    ...patient,
    nextOfKin: createdNextOfKin._id
  };

  // Generate registration code for the patient
  const registrationCode = await RegistrationCode.generateCode({
    patient: patientData,
    nextOfKin
  });

  // Add registration code to patient data
  patientData.registrationCode = registrationCode;
  
  // Create patient record
  const createdPatient = await Patient.create(patientData);

  // Return success response with registration code
  res.status(201).json({
    success: true,
    registrationCode,
    message: 'Patient registration successful'
  });
});

/**
 * @desc    Retrieve patient data by registration code
 * @route   GET /api/registration/:code
 * @access  Private (for hospital staff)
 */
const getRegistrationByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  // Find registration code in database
  const registrationCode = await RegistrationCode.findOne({
    code,
    expiresAt: { $gt: new Date() }
  });

  if (!registrationCode) {
    res.status(404);
    throw new Error('Invalid or expired registration code');
  }

  // Return patient data
  res.status(200).json({
    success: true,
    data: registrationCode.patientData
  });
});

/**
 * @desc    Mark registration code as used
 * @route   PUT /api/registration/:code/use
 * @access  Private (for hospital staff)
 */
const markRegistrationCodeAsUsed = asyncHandler(async (req, res) => {
  const { code } = req.params;

  // Find and update registration code
  const registrationCode = await RegistrationCode.findOneAndUpdate(
    { code },
    { isUsed: true },
    { new: true }
  );

  if (!registrationCode) {
    res.status(404);
    throw new Error('Invalid registration code');
  }

  res.status(200).json({
    success: true,
    message: 'Registration code marked as used'
  });
});

module.exports = {
  sendRegistrationLink,
  verifyRegistrationToken,
  submitRegistration,
  getRegistrationByCode,
  markRegistrationCodeAsUsed
};