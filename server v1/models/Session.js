import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  refreshToken: {
    type: String,
    unique: true,
    sparse: true
  },
  deviceInfo: {
    deviceId: String,
    deviceType: {
      type: String,
      enum: ['web', 'mobile', 'tablet', 'desktop', 'other'],
      default: 'web'
    },
    browser: String,
    os: String,
    ip: String,
    userAgent: String
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Auto-delete after 30 days
  }
}, {
  timestamps: true
});

// Compound indexes
// sessionSchema.index({ userId: 1, isActive: 1 });
// sessionSchema.index({ token: 1, isActive: 1 });
// sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { isActive: false } });

// // Update last activity
// sessionSchema.methods.updateActivity = async function() {
//   this.lastActivity = new Date();
//   await this.save();
// };

// // Deactivate session
// sessionSchema.methods.deactivate = async function() {
//   this.isActive = false;
//   await this.save();
// };

// // Check if session is expired
// sessionSchema.methods.isExpired = function() {
//   return this.expiresAt < new Date();
// };

const Session = mongoose.model('Session', sessionSchema);

export default Session;