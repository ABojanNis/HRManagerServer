const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne(({username:username}))
    .then(user => {
      if(!user) {
        const error = new Error('Entered username do not match our records')
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if(!isEqual) {
        const error = new Error('Entered password do not match our records')
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.username,
          userId: loadedUser._id.toString()
        },
        'somesecret',
        { expiresIn: '8h' }
      );
      res.status(200).json({ success: true, message: 'You are successfully logged in!', data: { token: token }, user: { id: loadedUser._id , username: loadedUser.username, name: loadedUser.name, surname: loadedUser.surname, is_admin: loadedUser.is_admin } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res, next) => {
  res.status(200).json({ success: true, message: 'You are successfully logged out!', data: null });
};
