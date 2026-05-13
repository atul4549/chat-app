import { create } from 'zustand';

const useChatStore = create((set) => ({
  // User
  user: {
    id: '1',
    name: 'Himanshu',
    phone: '+1234567890',
    avatar: null,
    status: 'Hey there! I am using ChatApp',
  },
  
  // Chats list
  chats: [
    {
      id: '1',
      name: 'Alice Johnson',
      lastMessage: 'See you tomorrow!',
      time: '10:30 AM',
      unread: 2,
      avatar: null,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      lastMessage: 'Thanks for the update',
      time: 'Yesterday',
      unread: 0,
      avatar: null,
      isOnline: false,
    },
    {
      id: '3',
      name: 'Carol Williams',
      lastMessage: 'Can you send the file?',
      time: 'Monday',
      unread: 1,
      avatar: null,
      isOnline: true,
    },
    {
      id: '4',
      name: 'Team Project',
      lastMessage: 'David: Meeting at 3 PM',
      time: '12:45 PM',
      unread: 5,
      avatar: null,
      isOnline: null,
      isGroup: true,
    },
  ],
  
  // Messages (keyed by chatId)
  messages: {
    '1': [
      {
        _id: '1',
        text: 'Hey! How are you?',
        createdAt: new Date('2024-01-15T10:00:00'),
        user: { _id: '2', name: 'Alice Johnson' },
      },
      {
        _id: '2',
        text: 'I am good, thanks! How about you?',
        createdAt: new Date('2024-01-15T10:05:00'),
        user: { _id: '1', name: 'John Doe' },
      },
      {
        _id: '3',
        text: 'See you tomorrow!',
        createdAt: new Date('2024-01-15T10:30:00'),
        user: { _id: '2', name: 'Alice Johnson' },
      },
    ],
    '2': [
      {
        _id: '1',
        text: 'Project update: Everything is on track',
        createdAt: new Date('2024-01-14T15:00:00'),
        user: { _id: '1', name: 'John Doe' },
      },
      {
        _id: '2',
        text: 'Thanks for the update',
        createdAt: new Date('2024-01-14T15:30:00'),
        user: { _id: '3', name: 'Bob Smith' },
      },
    ],
    '3': [
      {
        _id: '1',
        text: 'Can you send the file?',
        createdAt: new Date('2024-01-13T09:00:00'),
        user: { _id: '4', name: 'Carol Williams' },
      },
    ],
    '4': [
      {
        _id: '1',
        text: 'Welcome to the team group!',
        createdAt: new Date('2024-01-15T12:00:00'),
        user: { _id: '5', name: 'David' },
      },
      {
        _id: '2',
        text: 'Meeting at 3 PM',
        createdAt: new Date('2024-01-15T12:45:00'),
        user: { _id: '5', name: 'David' },
      },
    ],
  },
  
  // Contacts
  contacts: [
    { id: '2', name: 'Alice Johnson', phone: '+1234567891', avatar: null },
    { id: '3', name: 'Bob Smith', phone: '+1234567892', avatar: null },
    { id: '4', name: 'Carol Williams', phone: '+1234567893', avatar: null },
    { id: '5', name: 'David Brown', phone: '+1234567894', avatar: null },
    { id: '6', name: 'Eva Martinez', phone: '+1234567895', avatar: null },
    { id: '7', name: 'Frank Wilson', phone: '+1234567896', avatar: null },
  ],
  
  // Calls
  activeCall: null,
  callHistory: [],
  
  // Add message
  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: message.text, time: 'Just now' }
          : chat
      ),
    })),
  
  // Set active call
  setActiveCall: (call) => set({ activeCall: call }),
  
  // Clear active call
  clearActiveCall: () => set({ activeCall: null }),
  
  // Update user profile
  updateUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData },
    })),
}));

export default useChatStore;
