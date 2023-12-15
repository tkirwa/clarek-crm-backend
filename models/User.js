const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
