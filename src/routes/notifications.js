const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Get all notifications
router.get('/', protect, getNotifications);

// Get unread count
router.get('/unread-count', protect, getUnreadCount);

// Mark as read
router.put('/:id/read', protect, markAsRead);

// Mark all as read
router.put('/read-all', protect, markAllAsRead);

// Delete notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
