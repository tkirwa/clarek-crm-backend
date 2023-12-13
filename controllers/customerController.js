const redisClient = require('../config/redis');

// Controller function to fetch all customers
const getAllCustomers = async (req, res) => {
  try {
    // Fetch from MongoDB
    const customers = await Customer.find();

    // Store fetched data in Redis cache for future requests
    await redisClient.set('customers', JSON.stringify(customers));

    return res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCustomers,
};
