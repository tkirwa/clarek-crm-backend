// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get User By ID
router.get('/:id', userController.getUserByID);

module.exports = router;
