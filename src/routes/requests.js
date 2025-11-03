const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { protect, authorize } = require('../middlewares/auth');
const {
  createRequest, listRequests, assignWorker, updateStatus, getRequestById
} = require('../controllers/requestController');

router.post('/', protect, authorize('user'), upload.array('images', 5), createRequest);
router.get('/', protect, listRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id/assign', protect, assignWorker);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
