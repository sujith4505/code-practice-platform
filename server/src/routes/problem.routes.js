const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problem.controller');
const { authenticate, optionalAuthenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', optionalAuthenticate, problemController.getProblems);
router.get('/:id', optionalAuthenticate, problemController.getProblemDetail);

// Admin-only endpoints
router.post('/', authenticate, authorize('ADMIN'), problemController.createProblem);
router.put('/:id', authenticate, authorize('ADMIN'), problemController.updateProblem);
router.delete('/:id', authenticate, authorize('ADMIN'), problemController.deleteProblem);

module.exports = router;
