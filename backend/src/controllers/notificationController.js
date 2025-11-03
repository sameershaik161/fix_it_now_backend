const Notification = require('../models/Notification');

// Create notification (helper function to be used internally)
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get user's notifications
exports.getNotifications = async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
  
  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') {
    filter.isRead = false;
  }
  
  const notifications = await Notification.find(filter)
    .populate('sender', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ 
    recipient: req.user._id, 
    isRead: false 
  });
  
  res.json({
    notifications,
    total,
    unreadCount,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  });
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  if (String(notification.recipient) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.json(notification);
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  
  res.json({ message: 'All notifications marked as read' });
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  if (String(notification.recipient) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  await notification.deleteOne();
  res.json({ message: 'Notification deleted' });
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });
  
  res.json({ unreadCount: count });
};
