const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/run', submissionController.runCode); // Allow running code without login for demonstration if desired, or authenticate
router.post('/submit', authenticate, submissionController.submitCode);
router.get('/', authenticate, submissionController.getSubmissions);

module.exports = router;
