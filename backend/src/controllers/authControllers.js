const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res) => {
  const { name, email, password, role, phone, location, skills, bio } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({
    name, 
    email, 
    password, 
    role: role || 'user', 
    phone, 
    location, 
    bio,
    skills: (role === 'worker' && skills) ? skills : []
  });

  const token = signToken(user._id);
  
  // Return full user object without password (matching login response)
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
    skills: user.skills,
    rating: user.rating,
    ratingsCount: user.ratingsCount,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  
  res.status(201).json({ token, user: userResponse });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if(!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  user.password = undefined;
  res.json({ token, user });
};
