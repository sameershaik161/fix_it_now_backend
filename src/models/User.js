const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user','worker','admin'], default: 'user' },
  phone: { type: String },
  location: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  // worker-specific fields
  skills: [{ type: String }],
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// hash password
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(plain){
  return await bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
