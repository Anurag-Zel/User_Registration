const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    location: {
      city: { type: String, trim: true, maxlength: [100, 'City name cannot exceed 100 characters'] },
      country: { type: String, trim: true, maxlength: [100, 'Country name cannot exceed 100 characters'] }
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, 'Each skill cannot exceed 50 characters']
    }],
    experience: [{
      company: { type: String, required: true, trim: true, maxlength: [100, 'Company name cannot exceed 100 characters'] },
      position: { type: String, required: true, trim: true, maxlength: [100, 'Position cannot exceed 100 characters'] },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String, trim: true, maxlength: [500, 'Description cannot exceed 500 characters'] }
    }],
    education: [{
      institution: { type: String, required: true, trim: true, maxlength: [100, 'Institution name cannot exceed 100 characters'] },
      degree: { type: String, required: true, trim: true, maxlength: [100, 'Degree cannot exceed 100 characters'] },
      field: { type: String, trim: true, maxlength: [100, 'Field cannot exceed 100 characters'] },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      email: this.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('User', userSchema);
