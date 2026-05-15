import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from "expo-router";
import styles from './authStyle';
import { useAuthStore } from "@/store/useAuthStore";

import Icon from 'react-native-vector-icons/Ionicons';
const RegisterScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    uniqueId: "",
    mail: "",
    phoneNumber: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert("Validation Error", "Username is required");
      return false;
    }
    if (!formData.uniqueId.trim()) {
      Alert.alert("Validation Error", "Unique ID is required");
      return false;
    }
    if (!formData.password) {
      Alert.alert("Validation Error", "Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }
    // Optional email validation
    // if (formData.mail && !/\S+@\S+\.\S+/.test(formData.mail)) {
    //   Alert.alert("Validation Error", "Invalid email format");
    //   return false;
    // }
    // Optional phone validation
    // if (formData.phoneNumber && formData.phoneNumber.length < 10) {
    //   Alert.alert("Validation Error", "Phone number must be at least 10 digits");
    //   return false;
    // }

    return true;
  };

  const handleContinue = async () => {
    const isValid = validateForm();
    
    if (isValid) {
      try {
        await signup(formData);
        // Only navigate if signup is successful
        router.push('/PermissionRequestPage');
      } catch (error) {
        Alert.alert("Signup Failed", error.message || "Something went wrong");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
                      onPress={() => router.back()}
                      // style={styles.headerButton}
                    >
                      <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => updateFormData('username', value)}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Unique Id"
          value={formData.uniqueId}
          onChangeText={(value) => updateFormData('uniqueId', value)}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Phone (optional)"
          value={formData.phoneNumber}
          onChangeText={(value) => updateFormData('phoneNumber', value)}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="zohomail / gmail (optional)"
          value={formData.mail}
          onChangeText={(value) => updateFormData('mail', value)}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={isSigningUp}
      >
        <Text style={styles.buttonText}>
          {isSigningUp ? 'Creating Account...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('/login')}
        disabled={isSigningUp}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.terms}>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;