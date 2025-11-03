const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // assigned worker
  status: { 
    type: String, 
    enum: ['open','assigned','in_progress','completed','cancelled'], 
    default: 'open' 
  },
  images: [{ type: String }],
  price: { type: Number },
  scheduledAt: { type: Date },
  address: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add query middleware to exclude deleted requests by default
serviceRequestSchema.pre(/^find/, function(next) {
  // Only apply this to queries that don't explicitly ask for deleted items
  if (this.getFilter().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Add method to restore soft-deleted requests
serviceRequestSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

// Add static method to find deleted requests
serviceRequestSchema.statics.findDeleted = function() {
  return this.find({ isDeleted: true });
};

// Add static method to find with deleted (both deleted and non-deleted)
serviceRequestSchema.statics.findWithDeleted = function() {
  return this.find();
};

// Add timestamp middleware
serviceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
