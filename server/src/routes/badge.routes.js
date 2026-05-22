const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, badgeController.getUserBadges);
router.get('/:userId', optionalAuthenticate, badgeController.getUserBadges);

module.exports = router;
