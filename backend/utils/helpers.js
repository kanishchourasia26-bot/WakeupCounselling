const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.generateBookingId = () => {
  return 'WC' + Math.floor(10000 + Math.random() * 90000);
};
