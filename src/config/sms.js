// src/config/sms.js
require('dotenv').config();

// Check if required environment variables are set
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Validate required credentials
if (!accountSid || !authToken || !fromNumber) {
  console.warn('⚠️ Twilio credentials not fully configured in environment variables');
  console.warn('SMS functionality will be limited or disabled');
}

module.exports = {
  accountSid,
  authToken,
  fromNumber,
  isConfigured: !!(accountSid && authToken && fromNumber)
};