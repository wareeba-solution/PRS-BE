// backend/src/models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  otherNames: {
    type: String,
    required: [true, 'Other names are required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
    trim: true
  },
  maritalStatus: {
    type: String,
    required: [true, 'Marital status is required'],
    enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other']
  },
  contactAddress: {
    type: String,
    required: [true, 'Contact address is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  ethnicity: {
    type: String,
    required: [true, 'Ethnicity is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  registrationCode: {
    type: String,
    unique: true
  },
  nextOfKin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NextOfKin',
    required: [true, 'Next of kin information is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', PatientSchema);