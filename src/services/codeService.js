// backend/src/services/codeService.js
const crypto = require('crypto');
const RegistrationCode = require('../models/RegistrationCode');

/**
 * Generate a unique alphanumeric registration code
 * @param {number} length - Length of the code (default: 8)
 * @returns {string} - Generated code
 */
const generateUniqueCode = async (length = 8) => {
  let isUnique = false;
  let code;
  
  // Keep generating codes until we find a unique one
  while (!isUnique) {
    // Generate random bytes and convert to alphanumeric
    const randomBytes = crypto.randomBytes(Math.ceil(length * 3 / 4));
    code = randomBytes.toString('base64')
      .replace(/\+/g, '0')  // Replace + with 0
      .replace(/\//g, '0')  // Replace / with 0
      .replace(/=/g, '')    // Remove padding
      .slice(0, length)     // Get desired length
      .toUpperCase();       // Convert to uppercase
    
    // Check if this code already exists in the database
    const existingCode = await RegistrationCode.findOne({ code });
    
    if (!existingCode) {
      isUnique = true;
    }
  }
  
  return code;
};

/**
 * Generate a JSON object from registration code
 * @param {string} code - Registration code
 * @returns {Object} - Patient data as JSON
 */
const getPatientDataFromCode = async (code) => {
  const registrationCode = await RegistrationCode.findOne({ 
    code,
    expiresAt: { $gt: new Date() }
  });
  
  if (!registrationCode) {
    throw new Error('Invalid or expired registration code');
  }
  
  return registrationCode.patientData;
};

/**
 * Validate if a registration code is valid and not expired
 * @param {string} code - Registration code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateRegistrationCode = async (code) => {
  const registrationCode = await RegistrationCode.findOne({
    code,
    expiresAt: { $gt: new Date() }
  });
  
  return !!registrationCode;
};

module.exports = {
  generateUniqueCode,
  getPatientDataFromCode,
  validateRegistrationCode
};