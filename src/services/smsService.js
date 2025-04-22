// backend/src/services/smsService.js
const twilio = require('twilio');
const config = require('../config/sms');

// Initialize Twilio client with proper validation
let client;

// Check if we have valid Twilio credentials
if (config.accountSid && config.accountSid.startsWith('AC') && config.authToken) {
  client = twilio(config.accountSid, config.authToken);
  console.log('Twilio client initialized successfully');
} else {
  console.warn('Invalid or missing Twilio credentials. SMS functionality will be disabled.');
  // Mock client for development
  client = {
    messages: {
      create: (params) => {
        console.log('MOCK SMS:', params);
        return Promise.resolve({ sid: 'MOCK_SID', status: 'mock' });
      }
    }
  };
}

/**
 * Send registration link to patient via SMS
 * @param {string} phoneNumber - Patient's phone number
 * @param {string} registrationLink - Registration link
 * @returns {Promise} - Twilio response
 */
const sendRegistrationLink = async (phoneNumber, registrationLink) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    const message = await client.messages.create({
      body: `Complete your hospital registration by clicking this link: ${registrationLink} (Link expires in 24 hours)`,
      from: config.fromNumber,
      to: formattedNumber
    });
    
    return message;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send registration SMS');
  }
};

/**
 * Send registration confirmation with code via SMS
 * @param {string} phoneNumber - Patient's phone number
 * @param {string} registrationCode - Unique registration code
 * @returns {Promise} - Twilio response
 */
const sendRegistrationConfirmation = async (phoneNumber, registrationCode) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    const message = await client.messages.create({
      body: `Your hospital registration is complete. Your registration code is: ${registrationCode}. Please keep this code and present it when you arrive at the hospital.`,
      from: config.fromNumber,
      to: formattedNumber
    });
    
    return message;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send registration confirmation SMS');
  }
};

/**
 * Format phone number to international format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If number doesn't start with +, add country code (example: +1 for US)
  if (!phoneNumber.startsWith('+')) {
    // Default to +1 (US) if no country code
    cleaned = '1' + cleaned;
  }
  
  return '+' + cleaned;
};

module.exports = {
  sendRegistrationLink,
  sendRegistrationConfirmation
};