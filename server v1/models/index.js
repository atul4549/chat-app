import User from './User.js';
import Session from './Session.js';
import Chat from './Chat.js';
import Message from './Message.js';
import Attachment from './Attachment.js';
import Notification from './Notification.js';

// Define associations/references
User.hasMany = {
  sessions: Session,
  messages: Message,
  chats: Chat,
  notifications: Notification
};

// Export all models
export {
  User,
  Session,
  Chat,
  Message,
  Attachment,
  Notification
};

// Export default object for convenience
export default {
  User,
  Session,
  Chat,
  Message,
  Attachment,
  Notification
};