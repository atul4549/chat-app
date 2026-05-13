import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import Toast from 'react-native-toast-message';

// Get environment variable for React Native
const getBaseUrl = () => {
  // For React Native, you need to use your machine's IP address
  // You can store this in a .env file or config file
  if (__DEV__) {
    // Replace with your computer's local IP address
    return "http://192.168.1.100:5001"; 
  }
  return "https://your-production-url.com";
};

const BASE_URL = getBaseUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isConnected: false,

  checkAuth: async () => {
    try {
      // Check cached user first
      const cachedUser = await AsyncStorage.getItem('authUser');
      if (cachedUser) {
        set({ authUser: JSON.parse(cachedUser) });
      }
      
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      
      // Cache user data
      await AsyncStorage.setItem('authUser', JSON.stringify(res.data));
      
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      // Clear cached user if authentication fails
      await AsyncStorage.removeItem('authUser');
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      
      // Cache user data
      await AsyncStorage.setItem('authUser', JSON.stringify(res.data));
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully',
        position: 'bottom',
        visibilityTime: 3000,
      });
      
      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,
        position: 'bottom',
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      // Cache user data and token
      await AsyncStorage.setItem('authUser', JSON.stringify(res.data));
      if (res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
      }
      
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Logged in successfully',
        position: 'bottom',
      });

      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'bottom',
      });
      
      // Show alert for critical errors
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Invalid email or password');
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      
      // Clear cached data
      await AsyncStorage.multiRemove(['authUser', 'authToken']);
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Logged out successfully',
        position: 'bottom',
      });
      
      get().disconnectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: errorMessage,
        position: 'bottom',
      });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      
      // Update cached user data
      await AsyncStorage.setItem('authUser', JSON.stringify(res.data));
      
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Profile updated successfully',
        position: 'bottom',
      });
    } catch (error) {
      console.log("error in update profile:", error);
      const errorMessage = error.response?.data?.message || "Profile update failed";
      
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
        position: 'bottom',
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateAvatar: async (imageUri) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      
      const res = await axiosInstance.put("/auth/update-avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      set({ authUser: res.data });
      await AsyncStorage.setItem('authUser', JSON.stringify(res.data));
      
      Toast.show({
        type: 'success',
        text1: 'Avatar Updated',
        text2: 'Profile picture updated successfully',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.response?.data?.message || "Failed to update avatar",
        position: 'bottom',
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    // Socket configuration for React Native
    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ['websocket', 'polling'], // Important for React Native
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    newSocket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
      set({ isConnected: false });
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.connect();
    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  reconnectSocket: () => {
    const { socket, authUser } = get();
    if (!authUser) return;
    
    if (socket && !socket.connected) {
      socket.connect();
    } else if (!socket) {
      get().connectSocket();
    }
  },

  // Helper method to check if user is online
  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.includes(userId);
  },

  // Clear all user data (for complete logout)
  clearAllData: async () => {
    await AsyncStorage.multiRemove(['authUser', 'authToken', 'cached_users']);
    set({ authUser: null, onlineUsers: [], socket: null, isConnected: false });
  },
}));

// Optional: Create a hook for easy access to auth state
export const useAuth = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const isConnected = useAuthStore((state) => state.isConnected);
  
  return {
    authUser,
    isCheckingAuth,
    isLoggingIn,
    isSigningUp,
    isUpdatingProfile,
    onlineUsers,
    isConnected,
  };
};