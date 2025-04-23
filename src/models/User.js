const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['frontdesk'],
    default: 'frontdesk'
  }
}, {
  timestamps: true
});

// Encrypt password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add comparePassword method to the UserSchema
UserSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    console.log("Entered password:", enteredPassword); // Log entered password
    console.log("Stored password hash:", this.password); // Log stored password hash

    if (!this.password) {
      throw new Error("Password hash not found in the user document");
    }

    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Error during password comparison:", error);
    throw error; // Re-throw the error so it can be handled elsewhere
  }
};

module.exports = mongoose.model('User', UserSchema);
