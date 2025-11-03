const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');

// For admin or worker-approved actions
exports.verifyWorker = async (req, res) => {
  const worker = await User.findById(req.params.id);
  if(!worker || worker.role !== 'worker') return res.status(404).json({ message: 'Worker not found' });
  worker.isVerified = true;
  await worker.save();
  res.json({ message: 'Worker verified', worker });
};

// Get all workers with search and filter
exports.getWorkers = async (req, res) => {
  const { search, skills, location, minRating, page = 1, limit = 20, sort = '-rating' } = req.query;
  
  const filter = { role: 'worker' };
  
  // Search by name
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  
  // Filter by skills
  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    filter.skills = { $in: skillsArray };
  }
  
  // Filter by location
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  
  // Filter by minimum rating
  if (minRating) {
    filter.rating = { $gte: parseFloat(minRating) };
  }
  
  const workers = await User.find(filter)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort);
  
  const total = await User.countDocuments(filter);
  
  res.json({
    workers,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  });
};

// Get worker by ID with detailed info
exports.getWorkerById = async (req, res) => {
  const worker = await User.findById(req.params.id).select('-password');
  if (!worker || worker.role !== 'worker') {
    return res.status(404).json({ message: 'Worker not found' });
  }
  
  // Get completed jobs count
  const completedJobs = await ServiceRequest.countDocuments({
    worker: worker._id,
    status: 'completed'
  });
  
  res.json({ ...worker.toObject(), completedJobs });
};

// Worker Dashboard - Get statistics for logged-in worker
exports.getWorkerDashboard = async (req, res) => {
  if (req.user.role !== 'worker') {
    return res.status(403).json({ message: 'Only workers can access this dashboard' });
  }
  
  const workerId = req.user._id;
  
  // Get all requests for this worker
  const allRequests = await ServiceRequest.find({ worker: workerId });
  
  const stats = {
    totalJobs: allRequests.length,
    completedJobs: allRequests.filter(r => r.status === 'completed').length,
    inProgressJobs: allRequests.filter(r => r.status === 'in_progress').length,
    assignedJobs: allRequests.filter(r => r.status === 'assigned').length,
    totalEarnings: allRequests
      .filter(r => r.status === 'completed' && r.price)
      .reduce((sum, r) => sum + r.price, 0),
    averageRating: req.user.rating || 0,
    totalReviews: req.user.ratingsCount || 0,
    isVerified: req.user.isVerified
  };
  
  // Get recent requests
  const recentRequests = await ServiceRequest.find({ worker: workerId })
    .populate('requester', 'name phone location')
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.json({ stats, recentRequests });
};
