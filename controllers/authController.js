const User = require('../models/User');
const AfricasTalking = require('africastalking');

// const africastalking = require('africastalking')(process.env.AFRICASTALKING_API_KEY);

const africastalking = AfricasTalking({
    apiKey: 'process.env.AFRICASTALKING_API_KEY', 
    username: 'process.env.AFRICASTALKING_USERNAME'
  });

const sendVerificationCode = async (phone, code) => {
  const sms = africastalking.SMS;

  const options = {
    to: [`+254725226888`],
    message: `Your verification code is: ${code}`,
  };

  try {
    const response = await sms.send(options);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, phone, firstName, lastName, dateOfBirth, gender } = req.body;

    // Generate a random verification code (you might want to use a more secure method)
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
      email,
      phone,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      verificationCode,
    });

    await newUser.save();

    // Send verification code via Africa's Talking
    await sendVerificationCode(phone, verificationCode);

    res.status(201).json({ message: 'User registered successfully. Verification code sent to your phone.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
};
