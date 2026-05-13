// screens/PincodeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePincodeStore } from './usePincodeStore';
import { useAuthStore } from '@/store/useAuthStore';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PincodeScreen = ({ mode = 'verify' }) => { // mode: 'verify', 'set', 'change'
  const router = useRouter();
  const [pincode, setPincode] = useState('');
  const [confirmPincode, setConfirmPincode] = useState('');
  const [error, setError] = useState('');
  const [shakeAnimation] = useState(new Animated.Value(0));
  const { 
    verifyPincode, 
    setPincode: setPincodeApi,
    changePincode,
    isSettingPincode,
    isVerifyingPincode,
    pincodeAttempts,
    maxAttempts,
    lockUntil,
    isBiometricEnabled,
    setBiometricEnabled,
  } = usePincodeStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (hasHardware && isEnrolled && mode === 'verify') {
      // Ask user if they want to enable biometric
      Alert.alert(
        'Enable Biometric?',
        'Would you like to use fingerprint/Face ID for faster login?',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes', 
            onPress: async () => {
              const success = await authenticateWithBiometrics();
              if (success) {
                setBiometricEnabled(true);
                handleSuccess();
              }
            }
          }
        ]
      );
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your chats',
        fallbackLabel: 'Use pincode',
      });
      
      if (result.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const handleSuccess = () => {
    if (mode === 'verify') {
      router.replace('/(tabs)');
    } else {
      router.back();
    }
  };

  const handleBiometricAuth = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      handleSuccess();
    }
  };

  const shake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNumberPress = (num) => {
    if (mode === 'verify') {
      if (pincode.length < 6) {
        const newPincode = pincode + num;
        setPincode(newPincode);
        
        if (newPincode.length === 6) {
          verifyPincodeCode(newPincode);
        }
      }
    } else if (mode === 'set') {
      if (pincode.length < 6) {
        const newPincode = pincode + num;
        setPincode(newPincode);
        
        if (newPincode.length === 6) {
          setConfirmPincode(newPincode);
          setPincode('');
        }
      }
    } else if (mode === 'change') {
      if (pincode.length < 6) {
        const newPincode = pincode + num;
        setPincode(newPincode);
        
        if (newPincode.length === 6) {
          // Verify old pincode first
          verifyAndChangePincode(newPincode);
        }
      }
    }
  };

  const verifyPincodeCode = async (code) => {
    const isValid = await verifyPincode(code);
    
    if (isValid) {
      setTimeout(() => {
        handleSuccess();
      }, 500);
    } else {
      setPincode('');
      shake();
      
      // Check if locked
      if (lockUntil && new Date() < new Date(lockUntil)) {
        setError(`Too many attempts. Try again later.`);
      } else {
        setError(`Invalid pincode. ${maxAttempts - pincodeAttempts - 1} attempts remaining`);
      }
      
      setTimeout(() => setError(''), 3000);
    }
  };

  const verifyAndChangePincode = async (oldCode) => {
    const isValid = await verifyPincode(oldCode);
    
    if (isValid) {
      setPincode('');
      setConfirmPincode('');
      setError('');
      // Switch to set new pincode mode
      setMode('set');
    } else {
      setPincode('');
      shake();
      setError('Invalid current pincode');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSetPincode = async () => {
    if (pincode.length === 6 && confirmPincode.length === 6) {
      if (pincode === confirmPincode) {
        const success = await setPincodeApi(pincode);
        if (success) {
          handleSuccess();
        } else {
          setPincode('');
          setConfirmPincode('');
          shake();
          setError('Failed to set pincode. Please try again.');
        }
      } else {
        setPincode('');
        setConfirmPincode('');
        shake();
        setError('Pincodes do not match');
      }
    }
  };

  const handleDelete = () => {
    if (mode === 'verify' && pincode.length > 0) {
      setPincode(pincode.slice(0, -1));
    } else if (mode === 'set' && confirmPincode.length > 0) {
      setConfirmPincode(confirmPincode.slice(0, -1));
    }
  };

  const renderDots = () => {
    const dots = mode === 'verify' ? pincode : confirmPincode;
    return (
      <View style={styles.dotsContainer}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              dots.length > index && styles.dotFilled,
            ]}
          />
        ))}
      </View>
    );
  };

  const getTitle = () => {
    if (mode === 'verify') return 'Enter Pincode';
    if (mode === 'set') return 'Set Pincode';
    return 'Change Pincode';
  };

  const getSubtitle = () => {
    if (mode === 'verify') return 'Enter your 6-digit pincode to access your chats';
    if (mode === 'set') return 'Create a 6-digit pincode to secure your account';
    return 'Enter your current pincode to change it';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="lock-closed" size={60} color="#f4a261" />
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Pincode Dots */}
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          {renderDots()}
        </Animated.View>

        {/* Loading Indicator */}
        {(isSettingPincode || isVerifyingPincode) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f4a261" />
          </View>
        )}

        {/* Number Pad */}
        {!isSettingPincode && !isVerifyingPincode && (
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchOpacity
                key={num}
                style={styles.keyButton}
                onPress={() => handleNumberPress(num.toString())}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchOpacity>
            ))}
            
            <TouchOpacity 
              style={styles.keyButton}
              onPress={() => mode === 'set' && pincode.length === 6 && confirmPincode.length === 6 
                ? handleSetPincode() 
                : null}
            >
              {mode === 'set' && pincode.length === 6 && confirmPincode.length === 6 ? (
                <Icon name="checkmark" size={32} color="#4CAF50" />
              ) : (
                <Text style={styles.keyText}></Text>
              )}
            </TouchOpacity>
            
            <TouchOpacity
              style={styles.keyButton}
              onPress={() => handleNumberPress('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchOpacity>
            
            <TouchOpacity
              style={styles.keyButton}
              onPress={handleDelete}
            >
              <Icon name="backspace-outline" size={28} color="#f4a261" />
            </TouchOpacity>
          </View>
        )}

        {/* Biometric Authentication */}
        {mode === 'verify' && isBiometricEnabled && (
          <TouchableOpacity 
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
          >
            <Icon name="finger-print" size={32} color="#f4a261" />
            <Text style={styles.biometricText}>Use Biometric</Text>
          </TouchableOpacity>
        )}

        {/* Forgot Pincode */}
        {mode === 'verify' && (
          <TouchableOpacity 
            style={styles.forgotButton}
            onPress={() => {
              Alert.alert(
                'Forgot Pincode?',
                'A reset link will be sent to your registered email address.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Send Email', 
                    onPress: async () => {
                      // Implement forgot pincode logic
                      Toast.show({
                        type: 'info',
                        text1: 'Reset Link Sent',
                        text2: 'Check your email for instructions',
                        position: 'bottom',
                      });
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.forgotText}>Forgot Pincode?</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const TouchOpacity = TouchableOpacity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 40,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  dotFilled: {
    backgroundColor: '#f4a261',
    borderColor: '#f4a261',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  keyButton: {
    width: width * 0.2,
    height: width * 0.2,
    maxWidth: 80,
    maxHeight: 80,
    borderRadius: 40,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  keyText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  loadingContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    marginTop: 20,
  },
  biometricText: {
    fontSize: 16,
    color: '#f4a261',
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  forgotText: {
    fontSize: 14,
    color: '#f4a261',
  },
});

export default PincodeScreen;