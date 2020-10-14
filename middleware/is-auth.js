const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    const error = new Error('Token not provided!');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesecret');
  } catch(err) {
    const error = new Error('Token expired or blacklisted!');
    error.statusCode = 401;
    throw error;
  }
  if(!decodedToken) {
    const error = new Error('Invalid token!');
    error.statusCode = 401;
    throw Error;
  }
  next();
};