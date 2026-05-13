// store/usePincodeStore.js
import { create } from 'zustand';
import { axiosInstance } from '../../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const usePincodeStore = create((set, get) => ({
  isPincodeEnabled: false,
  pincode: null,
  isSettingPincode: false,
  isVerifyingPincode: false,
  pincodeAttempts: 0,
  maxAttempts: 5,
  lockUntil: null,
  isBiometricEnabled: false,
  
  // Enable/disable pincode
  setPincodeEnabled: async (enabled:any) => {
    set({ isPincodeEnabled: enabled });
    await AsyncStorage.setItem('isPincodeEnabled', JSON.stringify(enabled));
  },
  
  // Set new pincode
  setPincode: async (pincode:any) => {
    set({ isSettingPincode: true });
    try {
      const response = await axiosInstance.post('/auth/set-pincode', { pincode });
      
      if (response.data.success) {
        set({ 
          pincode: pincode,
          isPincodeEnabled: true,
          pincodeAttempts: 0,
        });
        
        // Store encrypted pincode locally
        await AsyncStorage.setItem('userPincode', pincode);
        await AsyncStorage.setItem('isPincodeEnabled', 'true');
        
        Toast.show({
          type: 'success',
          text1: 'Pincode Set',
          text2: 'Your pincode has been set successfully',
          position: 'bottom',
        });
        
        return true;
      }
    } catch (error: unknown) {
      console.error('Set pincode error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error.response?.data?.message || 'Could not set pincode',
        position: 'bottom',
      });
      return false;
    } finally {
      set({ isSettingPincode: false });
    }
  },
  
  // Verify pincode
  verifyPincode: async (enteredPincode: any) => {
    const { pincodeAttempts, maxAttempts, lockUntil } = get() as unknown;
    
    // Check if locked
    if (lockUntil && new Date() < new Date(lockUntil)) {
      const remainingMinutes = Math.ceil((new Date(lockUntil) - new Date()) / 60000);
      Toast.show({
        type: 'error',
        text1: 'Too Many Attempts',
        text2: `Please try again in ${remainingMinutes} minutes`,
        position: 'bottom',
      });
      return false;
    }
    
    set({ isVerifyingPincode: true });
    
    try {
      // First try local verification for speed
      const storedPincode = await AsyncStorage.getItem('userPincode');
      
      if (storedPincode === enteredPincode) {
        // Verify with server
        const response = await axiosInstance.post('/auth/verify-pincode', { pincode: enteredPincode });
        
        if (response.data.success) {
          set({ 
            pincodeAttempts: 0,
            lockUntil: null,
          });
          
          return true;
        }
      }
      
      // Increment attempts
      const newAttempts = pincodeAttempts + 1;
      const remainingAttempts = maxAttempts - newAttempts;
      
      if (newAttempts >= maxAttempts) {
        const lockDuration = 15; // minutes
        const lockUntilTime = new Date(Date.now() + lockDuration * 60000);
        set({ 
          lockUntil: lockUntilTime,
          pincodeAttempts: newAttempts,
        });
        
        Toast.show({
          type: 'error',
          text1: 'Account Locked',
          text2: `Too many failed attempts. Try again in ${lockDuration} minutes`,
          position: 'bottom',
        });
        
        // Notify server about failed attempts
        await axiosInstance.post('/auth/pincode-failed-attempt', { attempts: newAttempts });
      } else {
        set({ pincodeAttempts: newAttempts });
        Toast.show({
          type: 'error',
          text1: 'Invalid Pincode',
          text2: `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining`,
          position: 'bottom',
        });
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Verify pincode error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.response?.data?.message || 'Could not verify pincode',
        position: 'bottom',
      });
      return false;
    } finally {
      set({ isVerifyingPincode: false });
    }
  },
  
  // Change pincode
  changePincode: async (oldPincode, newPincode) => {
    set({ isSettingPincode: true });
    try {
      const response = await axiosInstance.post('/auth/change-pincode', { 
        oldPincode, 
        newPincode 
      });
      
      if (response.data.success) {
        set({ 
          pincode: newPincode,
          pincodeAttempts: 0,
        });
        
        await AsyncStorage.setItem('userPincode', newPincode);
        
        Toast.show({
          type: 'success',
          text1: 'Pincode Changed',
          text2: 'Your pincode has been updated',
          position: 'bottom',
        });
        
        return true;
      }
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Change Failed',
        text2: error.response?.data?.message || 'Could not change pincode',
        position: 'bottom',
      });
      return false;
    } finally {
      set({ isSettingPincode: false });
    }
  },
  
  // Reset pincode (forgot pincode)
  resetPincode: async (email, newPincode) => {
    set({ isSettingPincode: true });
    try {
      const response = await axiosInstance.post('/auth/reset-pincode', { 
        email, 
        newPincode 
      });
      
      if (response.data.success) {
        set({ 
          pincode: newPincode,
          pincodeAttempts: 0,
        });
        
        await AsyncStorage.setItem('userPincode', newPincode);
        
        Toast.show({
          type: 'success',
          text1: 'Pincode Reset',
          text2: 'Your pincode has been reset',
          position: 'bottom',
        });
        
        return true;
      }
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.response?.data?.message || 'Could not reset pincode',
        position: 'bottom',
      });
      return false;
    } finally {
      set({ isSettingPincode: false });
    }
  },
  
  // Clear pincode
  clearPincode: async () => {
    try {
      await axiosInstance.post('/auth/clear-pincode');
      set({ 
        isPincodeEnabled: false,
        pincode: null,
        pincodeAttempts: 0,
        lockUntil: null,
      });
      
      await AsyncStorage.multiRemove(['userPincode', 'isPincodeEnabled']);
      
      Toast.show({
        type: 'success',
        text1: 'Pincode Removed',
        text2: 'Pincode protection has been disabled',
        position: 'bottom',
      });
      
      return true;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Could not remove pincode',
        position: 'bottom',
      });
      return false;
    }
  },
  
  // Load pincode status on app start
  loadPincodeStatus: async () => {
    const isEnabled = await AsyncStorage.getItem('isPincodeEnabled');
    const storedPincode = await AsyncStorage.getItem('userPincode');
    
    set({ 
      isPincodeEnabled: isEnabled === 'true',
      pincode: storedPincode,
    });
  },
  
  // Enable/disable biometric
  setBiometricEnabled: async (enabled: any) => {
    set({ isBiometricEnabled: enabled });
    await AsyncStorage.setItem('isBiometricEnabled', JSON.stringify(enabled));
  },
}));
  export default usePincodeStore