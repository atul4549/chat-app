import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxLength: 150,
    default: '',
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    sparse: true,
  },
  uniqueId: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Add to User model
  pincode: {
    type: String,
    default: null,
  },
  isPincodeEnabled: {
    type: Boolean,
    default: false,
  },
  pincodeAttempts: {
    type: Number,
    default: 0,
  },
  pincodeLockUntil: {
    type: Date,
    default: null,
  },
  lastPincodeVerified: {
    type: Date,
    default: null,
  },
});

// Create text index for search functionality
userSchema.index({ name: 'text', email: 'text', uniqueId: 'text' });

// Method to exclude sensitive info
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;