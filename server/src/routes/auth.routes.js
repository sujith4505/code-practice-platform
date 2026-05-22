const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validator.middleware');
const { authenticate } = require('../middleware/auth.middleware');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('identifier').notEmpty().withMessage('Username or Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.login
);

router.post(
  '/refresh',
  [
    body('token').notEmpty().withMessage('Refresh token is required'),
    validate
  ],
  authController.refreshToken
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validate
  ],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    validate
  ],
  authController.resetPassword
);

router.post('/logout', authController.logout);
router.get('/dashboard', authenticate, authController.getDashboardStats);

module.exports = router;
