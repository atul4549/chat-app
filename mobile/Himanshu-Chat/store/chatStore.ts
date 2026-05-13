import { create } from "zustand";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// React Native toast alternative (optional - you can use a library like 'react-native-toast-message')
import Toast from 'react-native-toast-message';

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  onlineUsers: [],
  typingUsers: [],
  
//   // Cache for offline support
//   messageCache: new Map(),

  getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
      
//       // Cache users for offline access
//       await AsyncStorage.setItem('cached_users', JSON.stringify(res.data));
//     } catch (error) {
//       // Show error in React Native friendly way
//       const errorMessage = error.response?.data?.message || "Failed to load users";
      
//       // Option 1: Use Alert
//       Alert.alert("Error", errorMessage);
      
//       // Option 2: Use Toast (recommended)
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: errorMessage,
//         position: 'bottom',
//         visibilityTime: 3000,
//       });
      
//       // Load cached users if available
//       const cachedUsers = await AsyncStorage.getItem('cached_users');
//       if (cachedUsers) {
//         set({ users: JSON.parse(cachedUsers) });
//       }
//     } finally {
//       set({ isUsersLoading: false });
//     }
  },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
      
//       // Cache messages for offline access
//       const cacheKey = `messages_${userId}`;
//       await AsyncStorage.setItem(cacheKey, JSON.stringify(res.data));
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to load messages";
      
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: errorMessage,
//         position: 'bottom',
//       });
      
//       // Load cached messages if offline
//       const cacheKey = `messages_${userId}`;
//       const cachedMessages = await AsyncStorage.getItem(cacheKey);
//       if (cachedMessages) {
//         set({ messages: JSON.parse(cachedMessages) });
//       }
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },
  
//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     if (!selectedUser) return;
    
//     set({ isSendingMessage: true });
    
//     // Create temporary message for optimistic updates
//     const tempMessage = {
//       _id: `temp_${Date.now()}`,
//       text: messageData.text,
//       senderId: useAuthStore.getState().authUser?._id,
//       receiverId: selectedUser._id,
//       createdAt: new Date(),
//       isPending: true,
//     };

//     // Optimistically add message to UI
//     set({ messages: [...messages, tempMessage] });
    
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
//       // Replace temp message with real one
//       const updatedMessages = get().messages.map(msg => 
//         msg._id === tempMessage._id ? res.data : msg
//       );
//       set({ messages: updatedMessages });
      
//       // Cache the new message
//       const cacheKey = `messages_${selectedUser._id}`;
//       const cachedMessages = await AsyncStorage.getItem(cacheKey);
//       if (cachedMessages) {
//         const messages = JSON.parse(cachedMessages);
//         messages.push(res.data);
//         await AsyncStorage.setItem(cacheKey, JSON.stringify(messages));
//       }
      
//     } catch (error) {
//       // Remove failed message and show error
//       const errorMessage = error.response?.data?.message || "Failed to send message";
//       const filteredMessages = get().messages.filter(msg => msg._id !== tempMessage._id);
//       set({ messages: filteredMessages });
      
//       Toast.show({
//         type: 'error',
//         text1: 'Send Failed',
//         text2: errorMessage,
//         position: 'bottom',
//       });
//     } finally {
//       set({ isSendingMessage: false });
//     }
//   },
  
//   sendImageMessage: async (imageUri, imageData) => {
//     const { selectedUser, messages } = get();
//     if (!selectedUser) return;
    
//     set({ isSendingMessage: true });
    
//     const formData = new FormData();
//     formData.append('image', {
  //       uri: imageUri,
  //       type: 'image/jpeg',
//       name: 'photo.jpg',
//     });
//     formData.append('caption', imageData.caption || '');
    
//     try {
//       const res = await axiosInstance.post(`/messages/send-image/${selectedUser._id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Image Send Failed',
//         text2: error.response?.data?.message || "Failed to send image",
//         position: 'bottom',
//       });
//     } finally {
//       set({ isSendingMessage: false });
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;

//     // Remove existing listener to avoid duplicates
//     socket.off("newMessage");
    
//     socket.on("newMessage", (newMessage) => {
//       const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//       const isMessageSentToSelectedUser = newMessage.receiverId === selectedUser._id;
      
//       if (!isMessageSentFromSelectedUser && !isMessageSentToSelectedUser) return;

//       // Check if message already exists to avoid duplicates
//       const existingMessage = get().messages.find(msg => msg._id === newMessage._id);
//       if (existingMessage) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });
      
//       // Update local cache
//       const cacheKey = `messages_${selectedUser._id}`;
//       AsyncStorage.getItem(cacheKey).then(cached => {
//         if (cached) {
//           const messages = JSON.parse(cached);
//           messages.push(newMessage);
//           AsyncStorage.setItem(cacheKey, JSON.stringify(messages));
//         }
//       });
//     });
//   },
  
//   subscribeToTyping: () => {
//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;
    
//     socket.off("typing");
//     socket.on("typing", ({ userId, isTyping }) => {
//       const { selectedUser, typingUsers } = get();
//       if (selectedUser && userId === selectedUser._id) {
//         if (isTyping && !typingUsers.includes(userId)) {
//           set({ typingUsers: [...typingUsers, userId] });
//         } else if (!isTyping) {
//           set({ typingUsers: typingUsers.filter(id => id !== userId) });
//         }
//       }
//     });
//   },
  
//   sendTypingIndicator: (isTyping) => {
//     const { selectedUser } = get();
//     const socket = useAuthStore.getState().socket;
//     if (!socket || !selectedUser) return;
    
//     socket.emit("typing", {
//       receiverId: selectedUser._id,
//       isTyping,
//     });
//   },
  
//   subscribeToOnlineUsers: () => {
//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;
    
//     socket.off("getOnlineUsers");
//     socket.on("getOnlineUsers", (onlineUsers) => {
//       set({ onlineUsers });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     if (socket) {
//       socket.off("newMessage");
//       socket.off("typing");
//       socket.off("getOnlineUsers");
//     }
//     set({ typingUsers: [] });
//   },
  
//   markMessagesAsRead: async (userId) => {
//     try {
//       await axiosInstance.post(`/messages/mark-read/${userId}`);
      
//       // Update messages read status locally
//       const updatedMessages = get().messages.map(msg => 
//         msg.senderId === userId ? { ...msg, isRead: true } : msg
//       );
//       set({ messages: updatedMessages });
//     } catch (error) {
//       console.error("Failed to mark messages as read:", error);
//     }
//   },
  
//   deleteMessage: async (messageId) => {
//     try {
//       await axiosInstance.delete(`/messages/${messageId}`);
      
//       // Remove message locally
//       const filteredMessages = get().messages.filter(msg => msg._id !== messageId);
//       set({ messages: filteredMessages });
      
//       Toast.show({
//         type: 'success',
//         text1: 'Deleted',
//         text2: 'Message deleted successfully',
//         position: 'bottom',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Delete Failed',
//         text2: error.response?.data?.message || "Failed to delete message",
//         position: 'bottom',
//       });
//     }
//   },

//   setSelectedUser: (selectedUser) => {
//     set({ selectedUser });
//     // Mark messages as read when selecting a user
//     if (selectedUser) {
//       get().markMessagesAsRead(selectedUser._id);
//     }
//   },
  
//   clearChat: () => {
//     set({ messages: [], selectedUser: null, typingUsers: [] });
//   },
}));
  export default useChatStore