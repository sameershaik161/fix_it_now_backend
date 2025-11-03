const express = require('express');
const router = express.Router();
const { 
  verifyWorker, 
  getWorkers, 
  getWorkerById, 
  getWorkerDashboard 
} = require('../controllers/workerController');
const { protect, authorize } = require('../middlewares/auth');

// Get all workers with filters (public)
router.get('/', getWorkers);

// Get worker dashboard (worker only)
router.get('/dashboard', protect, authorize('worker'), getWorkerDashboard);

// Get worker by ID (public)
router.get('/:id', getWorkerById);

// Verify worker (admin only)
router.put('/:id/verify', protect, authorize('admin'), verifyWorker);

module.exports = router;
