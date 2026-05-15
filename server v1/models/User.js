import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    phone: String,
    location: String,
    website: String,
    birthday: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sound: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  devices: [{
    deviceId: String,
    deviceType: String,
    lastActive: Date,
    isActive: Boolean
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// userSchema.index({ email: 1 });
// userSchema.index({ name: 'text' });
// userSchema.index({ status: 1 });
// userSchema.index({ isOnline: 1 });
// userSchema.index({ lastSeen: -1 });

// // Virtual populate for messages
// userSchema.virtual('messages', {
//   ref: 'Message',
//   localField: '_id',
//   foreignField: 'sender'
// });

// // Virtual for unread messages count
// userSchema.virtual('unreadMessagesCount', {
//   ref: 'Message',
//   localField: '_id',
//   foreignField: 'recipient',
//   count: true,
//   match: { read: false }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     this.passwordChangedAt = Date.now() - 1000;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Generate password reset token
// userSchema.methods.createPasswordResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');
  
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
    
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
//   return resetToken;
// };

// // Generate email verification token
// userSchema.methods.createEmailVerificationToken = function() {
//   const verificationToken = crypto.randomBytes(32).toString('hex');
  
//   this.verificationToken = crypto
//     .createHash('sha256')
//     .update(verificationToken)
//     .digest('hex');
    
//   return verificationToken;
// };

// // Check if password was changed after JWT issued
// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false;
// };

// // Update last seen
// userSchema.methods.updateLastSeen = async function() {
//   this.lastSeen = new Date();
//   this.isOnline = true;
//   await this.save();
// };

const User = mongoose.model('User', userSchema);

export default User;