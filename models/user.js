// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  settings: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'English' },
  },
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  return jwt.sign({ phone: this.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// userSchema.methods.verifyToken = function (token) {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded.phone === this.phone;
//   } catch (error) {
//     return false;
//   }
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
