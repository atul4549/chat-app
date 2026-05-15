import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  text: {
    type: String,
    required: function() {
      return !this.attachments || this.attachments.length === 0;
    },
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: {
      type: String,
      enum: ['👍', '❤️', '😂', '😮', '😢', '🙏'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  metadata: {
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file', 'location', 'contact'],
      default: 'text'
    },
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    contact: {
      name: String,
      phone: String,
      email: String
    }
  },
  isForwarded: {
    type: Boolean,
    default: false
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ 'readBy.user': 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ chat: 1, 'readBy.user': 1 });

// Virtual for determining if message is read by a specific user
messageSchema.virtual('isReadBy').get(function() {
  return function(userId) {
    return this.readBy.some(r => r.user.toString() === userId.toString());
  };
});

// Method to mark message as read
messageSchema.methods.markAsRead = async function(userId) {
  if (!this.readBy.some(r => r.user.toString() === userId.toString())) {
    this.readBy.push({ user: userId, readAt: new Date() });
    await this.save();
  }
  return this;
};

// Method to mark message as delivered
messageSchema.methods.markAsDelivered = async function(userId) {
  if (!this.deliveredTo.includes(userId)) {
    this.deliveredTo.push(userId);
    await this.save();
  }
  return this;
};

// Method to add reaction
messageSchema.methods.addReaction = async function(userId, reaction) {
  const existingReaction = this.reactions.find(r => r.user.toString() === userId.toString());
  
  if (existingReaction) {
    existingReaction.reaction = reaction;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({ user: userId, reaction });
  }
  
  await this.save();
  return this;
};

// Method to remove reaction
messageSchema.methods.removeReaction = async function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  await this.save();
  return this;
};

// Method to edit message
messageSchema.methods.editMessage = async function(newText) {
  this.text = newText;
  this.isEdited = true;
  this.editedAt = new Date();
  await this.save();
  return this;
};

// Method to soft delete message
messageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.text = '[Message deleted]';
  await this.save();
  return this;
};

const Message = mongoose.model('Message', messageSchema);

export default Message;