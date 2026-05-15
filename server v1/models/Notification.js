
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['message', 'mention', 'friend_request', 'friend_accept', 'group_invite', 'system', 'reaction'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000), // 7 days
    index: { expires: 0 }
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = async function() {
  if (!this.isDelivered) {
    this.isDelivered = true;
    this.deliveredAt = new Date();
    await this.save();
  }
  return this;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;