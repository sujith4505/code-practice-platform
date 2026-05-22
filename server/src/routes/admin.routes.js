const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/users', authenticate, authorize('ADMIN'), adminController.getUsers);
router.get('/analytics', authenticate, authorize('ADMIN'), adminController.getAnalytics);

module.exports = router;
