const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, unique: true, required: false }, // No longer required
  phone: { type: String, unique: true, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
