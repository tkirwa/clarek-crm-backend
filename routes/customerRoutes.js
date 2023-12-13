const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Route to get all customers
router.get('/', customerController.getAllCustomers);

module.exports = router;
