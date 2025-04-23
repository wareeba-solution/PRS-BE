//src/models/RegistrationCode.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const RegistrationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  patientData: {
    type: Object,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
  }
}, {
  timestamps: true
});

// Method to generate a unique registration code
RegistrationCodeSchema.statics.generateCode = async function(patientData) {
  // Generate a random string and hash it to create a unique code
  const randomString = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(randomString).digest('hex');
  
  // Use first 8 characters of the hash as the code
  const code = hash.substring(0, 8).toUpperCase();
  
  // Create and save the registration code entry
  const registrationCode = new this({
    code,
    patientData
  });
  
  await registrationCode.save();
  return code;
};

module.exports = mongoose.model('RegistrationCode', RegistrationCodeSchema);