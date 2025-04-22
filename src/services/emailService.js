// backend/src/services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/email');

/**
 * Create email transporter
 */
const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.user,
    pass: config.password
  }
});

/**
 * Send registration link to patient via email
 * @param {string} email - Patient's email address
 * @param {string} registrationLink - Registration link
 * @returns {Promise} - Nodemailer response
 */
const sendRegistrationLink = async (email, registrationLink) => {
  try {
    const mailOptions = {
      from: `"${config.senderName}" <${config.senderEmail}>`,
      to: email,
      subject: 'Complete Your Patient Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3366cc;">Hospital Patient Registration</h2>
          <p>Thank you for initiating your registration at our hospital.</p>
          <p>Please click the link below to complete your registration:</p>
          <p>
            <a href="${registrationLink}" style="background-color: #3366cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Complete Registration
            </a>
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not request this registration, please ignore this email.</p>
          <p>Thank you,<br>Hospital Registration Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send registration email');
  }
};

/**
 * Send registration confirmation with code
 * @param {string} email - Patient's email address
 * @param {string} registrationCode - Unique registration code
 * @returns {Promise} - Nodemailer response
 */
const sendRegistrationConfirmation = async (email, registrationCode) => {
  try {
    const mailOptions = {
      from: `"${config.senderName}" <${config.senderEmail}>`,
      to: email,
      subject: 'Your Patient Registration is Complete',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3366cc;">Registration Complete</h2>
          <p>Thank you for completing your registration at our hospital.</p>
          <p>Your unique registration code is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; font-size: 24px; text-align: center; letter-spacing: 3px; font-weight: bold; margin: 20px 0;">
            ${registrationCode}
          </div>
          <p>Please keep this code safe. You will need to provide it when you arrive at the hospital.</p>
          <p>Thank you,<br>Hospital Registration Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send registration confirmation email');
  }
};

module.exports = {
  sendRegistrationLink,
  sendRegistrationConfirmation
};