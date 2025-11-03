const User = require('../models/User');
const Review = require('../models/Review');

// get current user profile
exports.me = async (req, res) => {
  res.json(req.user);
};

// update profile (basic)
exports.updateProfile = async (req, res) => {
  const updates = (({ name, phone, location, bio, profileImage }) => ({ name, phone, location, bio, profileImage }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
  res.json(user);
};

// list workers (filter by skills, location)
exports.listWorkers = async (req, res) => {
  const { skill, location, page = 1, limit = 20 } = req.query;
  const filter = { role: 'worker' };
  if(skill) filter.skills = { $in: [skill] };
  if(location) filter.location = new RegExp(location, 'i');

  const workers = await User.find(filter)
    .skip((page-1)*limit)
    .limit(parseInt(limit))
    .select('-password');

  res.json({ count: workers.length, workers });
};

// get worker profile with reviews
exports.getWorker = async (req, res) => {
  const worker = await User.findById(req.params.id).select('-password');
  if(!worker || worker.role !== 'worker') return res.status(404).json({ message: 'Worker not found' });

  const reviews = await Review.find({ worker: worker._id }).populate('author','name profileImage');
  res.json({ worker, reviews });
};
