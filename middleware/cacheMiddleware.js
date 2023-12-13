const redisClient = require('../config/redis');

const checkCache = (req, res, next) => {
  const { key } = req.params; // Assuming you pass the key as a parameter in the route
  
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Error checking cache:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data) {
      // If data is available in cache, send the cached data
      const parsedData = JSON.parse(data);
      return res.json(parsedData);
    } else {
      // If data is not in cache, proceed to the next middleware/route handler
      next();
    }
  });
};

module.exports = {
  checkCache,
};
