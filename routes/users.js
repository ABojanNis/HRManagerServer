const express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/users');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, usersController.getUsers);

router.get('/:userId', isAuth, usersController.getUser);

router.post(
  '/',
  isAuth,
  isAdmin,
  [
    body('username')
      .exists()
      .withMessage('Username field is required'),
    body('name')
      .exists()
      .withMessage('Name field is required'),
    body('surname')
      .exists()
      .withMessage('Surname field is required'),
    body('is_admin')
      .exists()
      .withMessage('Is admin field is required'),
    body('user')
      .exists()
      .withMessage('User field is required')
  ], 
  usersController.postUser);

router.put(
  '/:userId',
  isAuth,
  isAdmin,
  [
    body('username')
      .exists()
      .withMessage('Username field is required'),
    body('name')
      .exists()
      .withMessage('Name field is required'),
    body('surname')
      .exists()
      .withMessage('Surname field is required'),
    body('is_admin')
      .exists()
      .withMessage('Is admin field is required'),
    body('user')
      .exists()
      .withMessage('User field is required')
  ],
  usersController.putUser);

router.delete('/:userId/:isAdmin', isAuth, isAdmin, usersController.deleteUser);

router.post('/:userId/changePassword',
  isAuth,
  [
    body('newPassword')
      .exists()
      .withMessage('New password field is required'),
    body('oldPassword')
      .exists()
      .withMessage('Old password field is required')
  ],
  usersController.changePassword);

module.exports = router;