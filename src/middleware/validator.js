// src/validators/authValidator.js
const { body } = require('express-validator');

exports.loginValidator = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
];
