// backend/src/config/email.js
module.exports = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    senderName: process.env.EMAIL_SENDER_NAME || 'Hospital Registration',
    senderEmail: process.env.EMAIL_SENDER_EMAIL || 'noreply@hospital.com'
  };
  