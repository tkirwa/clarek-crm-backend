const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
