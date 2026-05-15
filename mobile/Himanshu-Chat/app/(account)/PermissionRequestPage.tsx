import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  // StyleSheet,
  // ScrollView,
  // Image,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { Platform } from 'react-native';
// import { useRouter } from 'expo-router';
import styles from './PermissionRequestStyle'; 
const PermissionRequestPage = () => {
  // const navigation = useRouter()
  const [permissions, setPermissions] = useState([
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'Find your friends and family who use ChatApp',
      icon: 'people-outline',
      granted: false,
      required: true,
      permissionType: Platform.select({
        ios: PERMISSIONS.IOS.CONTACTS,
        android: PERMISSIONS.ANDROID.READ_CONTACTS,
      }),
    },
    {
      id: 'camera',
      title: 'Camera',
      description: 'Take photos and videos to share with your contacts',
      icon: 'camera-outline',
      granted: false,
      required: true,
      permissionType: Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    },
    {
      id: 'microphone',
      title: 'Microphone',
      description: 'Send voice messages and make voice calls',
      icon: 'mic-outline',
      granted: false,
      required: true,
      permissionType: Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      }),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Stay updated with new messages and calls',
      icon: 'notifications-outline',
      granted: false,
      required: false,
      permissionType: null, // Notifications handled separately
    },
    {
      id: 'storage',
      title: 'Storage',
      description: 'Save and share photos, videos, and documents',
      icon: 'folder-outline',
      granted: false,
      required: false,
      permissionType: Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      }),
    },
  ]);

  const [currentPermissionIndex, setCurrentPermissionIndex] = useState(0);
  const [allPermissionsGranted, setAllPermissionsGranted] = useState(false);

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const updatedPermissions = [...permissions];
    
    for (let i = 0; i < updatedPermissions.length; i++) {
      const perm = updatedPermissions[i];
      if (perm.permissionType) {
        try {
          const result = await check(perm.permissionType);
          updatedPermissions[i] = {
            ...perm,
            granted: result === RESULTS.GRANTED,
          };
        } catch (error) {
          console.log(`Error checking ${perm.id} permission:`, error);
        }
      }
    }
    
    setPermissions(updatedPermissions);
    checkAllGranted(updatedPermissions);
  };

  const checkAllGranted = (perms: any) => {
    const requiredPermissions = perms.filter((p: any) => p.required);
    const allGranted = requiredPermissions.every((p: any) => p.granted);
    setAllPermissionsGranted(allGranted);
  };

  const requestPermission = async (permission: any) => {
    if (permission.id === 'notifications') {
      // Handle notifications separately
      const updatedPermissions = permissions.map(p =>
        p.id === permission.id ? { ...p, granted: true } : p
      );
      setPermissions(updatedPermissions);
      return true;
    }

    try {
      const result = await request(permission.permissionType);
      const granted = result === RESULTS.GRANTED;
      
      const updatedPermissions = permissions.map(p =>
        p.id === permission.id ? { ...p, granted } : p
      );
      
      setPermissions(updatedPermissions);
      checkAllGranted(updatedPermissions);
      return granted;
    } catch (error) {
      console.log(`Error requesting ${permission.id} permission:`, error);
      return false;
    }
  };

  const handleContinue = async () => {
    const currentPermission = permissions[currentPermissionIndex];
    const granted = await requestPermission(currentPermission);
    
    if (currentPermissionIndex < permissions.length - 1) {
      // Move to next permission
      setCurrentPermissionIndex(prev => prev + 1);
    } else {
      // All permissions processed
      checkAllGranted(permissions);
      if (allPermissionsGranted) {
        // navigation.replace('ChatList');
      }
    }
  };

  const handleSkipAll = () => {
    // Allow user to skip and proceed
    // navigation.replace('ChatList');
  };

  const handleGoBack = () => {
    if (currentPermissionIndex > 0) {
      setCurrentPermissionIndex(prev => prev - 1);
    }
  };

  const currentPermission = permissions[currentPermissionIndex];
  const isLastPermission = currentPermissionIndex === permissions.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {permissions.map((perm, index) => (
            <View
              key={perm.id}
              style={[
                styles.progressStep,
                index <= currentPermissionIndex && styles.progressStepActive,
                perm.granted && styles.progressStepGranted,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          {currentPermissionIndex + 1} of {permissions.length}
        </Text>
      </View>

      {/* Back Button */}
      {currentPermissionIndex > 0 && (
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Permission Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon
              name={currentPermission.icon}
              size={60}
              color="#075E54"
            />
          </View>
        </View>

        {/* Permission Title */}
        <Text style={styles.title}>
          {currentPermission.granted
            ? `${currentPermission.title} Access Granted`
            : `Allow ${currentPermission.title}`}
        </Text>

        {/* Permission Description */}
        <Text style={styles.description}>
          {currentPermission.description}
        </Text>

        {/* Permission Status */}
        {currentPermission.granted ? (
          <View style={styles.grantedBadge}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.grantedText}>Permission Granted</Text>
          </View>
        ) : (
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="shield-checkmark-outline" size={20} color="#075E54" />
              <Text style={styles.featureText}>
                Your privacy is our priority
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="settings-outline" size={20} color="#075E54" />
              <Text style={styles.featureText}>
                You can change this later in Settings
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="information-circle-outline" size={20} color="#075E54" />
              <Text style={styles.featureText}>
                {currentPermission.required
                  ? 'Required for full functionality'
                  : 'Optional but recommended'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !currentPermission.required && styles.optionalButton,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {currentPermission.granted
              ? isLastPermission
                ? 'Finish'
                : 'Next'
              : currentPermission.required
              ? 'Allow'
              : 'Allow Access'}
          </Text>
          <Icon
            name="arrow-forward"
            size={20}
            color={currentPermission.required ? '#fff' : '#075E54'}
          />
        </TouchableOpacity>

        {!currentPermission.required && !currentPermission.granted && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleContinue}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.skipAllButton}
          onPress={handleSkipAll}
        >
          <Text style={styles.skipAllText}>Skip All</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.privacyIcon}>
          <Icon name="lock-closed" size={16} color="#999" />
          <Text style={styles.privacyText}>
            We never store your data without permission
          </Text>
        </View>
      </View>
    </View>
  );
};



export default PermissionRequestPage;