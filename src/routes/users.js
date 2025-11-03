const express = require('express');
const router = express.Router();
const { me, updateProfile, listWorkers, getWorker } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

// current user
router.get('/me', protect, me);
router.put('/me', protect, updateProfile);

// workers listing open to all (or protect if you prefer)
router.get('/workers', listWorkers);
router.get('/workers/:id', getWorker);

module.exports = router;
