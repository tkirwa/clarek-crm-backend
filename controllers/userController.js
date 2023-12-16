// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get one user by ID
exports.getUserByID = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user details
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      settings: user.settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
