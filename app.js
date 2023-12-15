const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const redis = require('redis');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// Middleware to parse JSON data
app.use(express.json());


// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,          // Use the new URL parser
  // useUnifiedTopology: true,      // Use the new Server Discover and Monitoring engine
  // Other options if needed
});


// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
  // Other options
  retry_strategy: (options) => {
    // Specify how to handle connection retries
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built-in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
  // Add more options as needed
});

// Event listeners for Redis client
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error(`Error connecting to Redis: ${err}`);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Set up the server to listen on port 3000
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available, otherwise default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
