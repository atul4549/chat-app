// import axios from "axios";

// export const axiosInstance = axios.create({
  // const BASE_URL = "https://chat-app-server-da9t.onrender.com/api"
//   // baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
//   withCredentials: true,
// });


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = __DEV__ 
const BASE_URL = 'http://localhost:5000/api'
  // ? 'http://192.168.1.100:5001/api' // Your backend IP
  // : 'https://your-api.com/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add token to requests
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);