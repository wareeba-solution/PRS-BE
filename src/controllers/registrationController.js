// backend/src/controllers/registrationController.js
const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const NextOfKin = require('../models/NextOfKin');
const RegistrationCode = require('../models/RegistrationCode');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const codeService = require('../services/codeService');




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

  // Store the token in the database with expiry (24 hours) and contact info
  await RegistrationCode.create({
    code: token,
    patientData: {},
    isUsed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    contactMethod, // Store how we contacted the patient
    contactValue   // Store the patient's contact information
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
 * @desc    Submit patient registration with token
 * @route   POST /api/registration/submit-with-token
 * @access  Public
 */
const submitRegistrationWithToken = asyncHandler(async (req, res) => {
  const { token, patient, nextOfKin } = req.body;

  // Validate input data
  if (!token || !patient || !nextOfKin) {
    res.status(400);
    throw new Error('Please provide token, patient, and next of kin information');
  }

  // Find the registration code entry
  const registrationCode = await RegistrationCode.findOne({
    code: token,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!registrationCode) {
    res.status(400);
    throw new Error('Invalid or expired registration token');
  }

  // Create next of kin record
  const createdNextOfKin = await NextOfKin.create(nextOfKin);

  // Generate verification code for the front desk
  const verificationCode = await codeService.generateUniqueCode(6);

  // Create patient record with reference to next of kin
  const patientData = {
    ...patient,
    nextOfKin: createdNextOfKin._id,
    registrationCode: verificationCode
  };
  
  // Create patient record
  const createdPatient = await Patient.create(patientData);

  // Update the registration code entry with patient data and mark as used
  registrationCode.patientData = {
    patient: createdPatient._id,
    nextOfKin: createdNextOfKin._id,
    code: verificationCode
  };
  
  registrationCode.isUsed = true;
  await registrationCode.save();

  // Send the verification code using the same contact method used initially
  const contactMethod = registrationCode.contactMethod;
  const contactValue = registrationCode.contactValue;
  
  if (contactMethod && contactValue) {
    try {
      if (contactMethod === 'email') {
        await emailService.sendRegistrationConfirmation(contactValue, verificationCode);
        console.log(`Verification code sent via email to ${contactValue}`);
      } else if (contactMethod === 'sms') {
        await smsService.sendRegistrationConfirmation(contactValue, verificationCode);
        console.log(`Verification code sent via SMS to ${contactValue}`);
      }
    } catch (error) {
      console.error(`Failed to send verification code via ${contactMethod}:`, error);
      // Continue processing even if sending fails
    }
  } else {
    // Fall back to patient's provided contact methods if original contact info not found
    if (patient.emailAddress) {
      try {
        await emailService.sendRegistrationConfirmation(patient.emailAddress, verificationCode);
      } catch (error) {
        console.error('Failed to send email confirmation:', error);
      }
    }
    
    if (patient.phoneNumber) {
      try {
        await smsService.sendRegistrationConfirmation(patient.phoneNumber, verificationCode);
      } catch (error) {
        console.error('Failed to send SMS confirmation:', error);
      }
    }
  }

  // Return success response with verification code
  res.status(201).json({
    success: true,
    verificationCode,
    message: 'Patient registration successful'
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
 * @desc    Retrieve patient data by verification code
 * @route   GET /api/registration/verify-code/:code
 * @access  Private (for hospital staff)
 */
const getPatientByVerificationCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  // Find patient by registration code
  const patient = await Patient.findOne({
    registrationCode: code
  }).populate('nextOfKin');

  if (!patient) {
    res.status(404);
    throw new Error('Invalid verification code or patient not found');
  }

  // Return patient data
  res.status(200).json({
    success: true,
    data: {
      patient,
      nextOfKin: patient.nextOfKin
    }
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
  const registrationCode = await codeService.generateUniqueCode(8);

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
  submitRegistrationWithToken,
  getRegistrationByCode,
  getPatientByVerificationCode,
  markRegistrationCodeAsUsed
};