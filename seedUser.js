// backend/seedUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedFrontdeskUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'frontdesk@hospital.com' });
    if (existing) {
      console.log('Frontdesk user already exists.');
      return process.exit();
    }

    await User.create({
      name: 'Frontdesk Admin',
      email: 'frontdesk@hospital.com',
      password: 'password123'
    });

    console.log('✅ Frontdesk user seeded successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFrontdeskUser();
