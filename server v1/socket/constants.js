// Socket event constants
export const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  DISCONNECT_USER: 'disconnect-user',
  
  // User events
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  USER_CONNECTED: 'user-connected',
  USER_STATUS_CHANGED: 'user-status-changed',
  ONLINE_USERS: 'online-users',
  FORCE_DISCONNECT: 'force-disconnect',
  
  // Chat events
  JOIN_CHAT: 'join-chat',
  LEAVE_CHAT: 'leave-chat',
  
  // Typing events
  TYPING: 'typing',
  STOP_TYPING: 'stop-typing',
  USER_STOP_TYPING: 'user-stop-typing',
  
  // Message events
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
  NEW_MESSAGE_NOTIFICATION: 'new-message-notification',
  MARK_MESSAGES_READ: 'mark-messages-read',
  MESSAGES_READ_BY: 'messages-read-by',
  
  // Error events
  SOCKET_ERROR: 'socket-error',
};

export const USER_STATUS = {
  ONLINE: 'online',
  AWAY: 'away',
  BUSY: 'busy',
  OFFLINE: 'offline',
};

export const SOCKET_CONFIG = {
  PING_TIMEOUT: 60000,
  PING_INTERVAL: 25000,
};