const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', [
  body('username')
    .exists()
    .withMessage('Username field is required'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], authController.login);

router.post('/logout', authController.logout);

module.exports = router;