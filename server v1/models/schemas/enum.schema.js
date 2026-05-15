// Shared enum definitions
export const UserStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
};

export const ChatType = {
  DIRECT: 'direct',
  GROUP: 'group',
  CHANNEL: 'channel'
};

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  LOCATION: 'location',
  CONTACT: 'contact'
};

export const NotificationType = {
  MESSAGE: 'message',
  MENTION: 'mention',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPT: 'friend_accept',
  GROUP_INVITE: 'group_invite',
  SYSTEM: 'system',
  REACTION: 'reaction'
};

export const AttachmentType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  OTHER: 'other'
};