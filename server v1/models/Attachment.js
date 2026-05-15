import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  width: Number,
  height: Number,
  duration: Number, // For audio/video files
  metadata: {
    // Additional metadata specific to file type
    caption: String,
    alt: String,
    compression: String
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000), // 30 days
    index: { expires: 0 }
  }
}, {
  timestamps: true
});

// Indexes
attachmentSchema.index({ message: 1 });
attachmentSchema.index({ sender: 1 });
attachmentSchema.index({ type: 1 });
attachmentSchema.index({ createdAt: -1 });

// Method to get file size in human readable format
attachmentSchema.methods.getReadableSize = function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// Method to check if attachment is an image
attachmentSchema.methods.isImage = function() {
  return this.type === 'image';
};

// Method to check if attachment is a video
attachmentSchema.methods.isVideo = function() {
  return this.type === 'video';
};

const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;