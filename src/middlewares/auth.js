const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {};

auth.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({ message: 'Not authorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

auth.authorize = (...roles) => (req, res, next) => {
  if(!req.user) return res.status(401).json({ message: 'Not authorized' });
  if(!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = auth;
