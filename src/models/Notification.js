const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['request_assigned', 'status_update', 'new_review', 'worker_verified', 'general'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  relatedReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
