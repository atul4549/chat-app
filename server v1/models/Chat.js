import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['direct', 'group', 'channel'],
    required: true,
    default: 'direct'
  },
  name: {
    type: String,
    required: function() {
      return this.type === 'group' || this.type === 'channel';
    },
    trim: true,
    maxlength: [100, 'Chat name cannot exceed 100 characters']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  groupAvatar: {
    type: String,
    default: null
  },
  groupDescription: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowMedia: {
      type: Boolean,
      default: true
    },
    allowLinks: {
      type: Boolean,
      default: true
    },
    onlyAdminsCanSend: {
      type: Boolean,
      default: false
    }
  },
  pinnedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  mutedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    until: Date
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ lastMessageAt: -1 });
chatSchema.index({ createdAt: -1 });
chatSchema.index({ 'participants': 1, 'type': 1 });

// Virtual for unread messages count per user
chatSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat'
});

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.includes(userId);
};

// Method to check if user is admin
chatSchema.methods.isAdmin = function(userId) {
  return this.admins.includes(userId);
};

// Method to add participant
chatSchema.methods.addParticipant = async function(userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    await this.save();
  }
  return this;
};

// Method to remove participant
chatSchema.methods.removeParticipant = async function(userId) {
  this.participants = this.participants.filter(p => p.toString() !== userId.toString());
  this.admins = this.admins.filter(a => a.toString() !== userId.toString());
  await this.save();
  return this;
};

// Method to mute chat for user
chatSchema.methods.muteForUser = async function(userId, durationHours = 24) {
  const muteUntil = new Date();
  muteUntil.setHours(muteUntil.getHours() + durationHours);
  
  const existingMute = this.mutedBy.find(m => m.user.toString() === userId.toString());
  if (existingMute) {
    existingMute.until = muteUntil;
  } else {
    this.mutedBy.push({ user: userId, until: muteUntil });
  }
  
  await this.save();
  return this;
};

// Method to unmute chat for user
chatSchema.methods.unmuteForUser = async function(userId) {
  this.mutedBy = this.mutedBy.filter(m => m.user.toString() !== userId.toString());
  await this.save();
  return this;
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;