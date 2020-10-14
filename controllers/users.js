const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  const search = req.query.q;
  const currentPage = Number(req.query.page) || 1;
  const perPage = Number(req.query.itemsPerPage) || 100;
  let total, totalPages;
  User.find({ username: { $regex: search, $options: "i" }})
    .countDocuments()
    .then(count => {
      total = count;
      totalPages = Math.ceil(count / perPage);
      return User.find({ name: { $regex: search, $options: "i" }}, {}, { sort: { _id: -1 } })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(users => {
      res.status(200).json({ success: true, message: 'Ok', data: users, meta: { pagination: { total, perPage, currentPage, totalPages } } });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.getUser = (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .then(user => {
      if(!user) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ success: true, message: 'Ok', data: user });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const surname = req.body.surname;
  const password = req.body.password;
  const is_admin = req.body.is_admin;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }

  bcrypt.hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        username: username,
        password: hashedPw,
        name: name,
        surname: surname,
        is_admin: is_admin
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'User successfully created!',
        data: result
      });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putUser = (req, res, next) => {
  const id = req.params.userId;
  const username = req.body.username;
  const name = req.body.name;
  const surname = req.body.surname;
  const is_admin = req.body.is_admin;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.errors = errors.array();
    error.statusCode = 422;
    throw error;
  }
  
  User.findById(id)
    .then(user => {
      if(!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      user.username = username;
      user.name = name;
      user.surname = surname;
      user.is_admin = is_admin;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'User succesfully edited!', user: result });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if(!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      return User.findByIdAndDelete(id);
    })
    .then(result => {
      res.status(200).json({ success: true, message: 'User succesfully deleted!', data: null });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.changePassword = (req, res, next) => {
  const id = req.params.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }
  let loadedUser;
  User.findById(id)
    .then(user => {
      if(!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(oldPassword, user.password);
    })
    .then(isEqual => {
      if(!isEqual) {
        const error = new Error('Old password do not match our records')
        error.statusCode = 404;
        next(error);
      }
      bcrypt.hash(newPassword, 12)
        .then(hashedPw => {
          loadedUser.password = hashedPw;
          return loadedUser.save();
        })
        .then(result => {
          res.status(201).json({
            success: true,
            message: 'User password succesfully changed!',
            data: result
          });
        })
        .catch(err => {
          if(!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    });
};

function escapeRegex(text) {
  if(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
};