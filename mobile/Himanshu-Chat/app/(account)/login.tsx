import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from "expo-router";
import styles from './authStyle';
import { useAuthStore } from "../store/useAuthStore";

const LoginScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    uniqueId: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleContinue = () => {
    // Handle login logic here
    login(formData);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Unique Id"
          value={formData.uniqueId}
          onChangeText={(value) => updateFormData('uniqueId', value)}
          keyboardType="phone-pad"
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
        disabled={isLoggingIn}
      >
        <Text style={styles.buttonText}>
          {isLoggingIn ? 'Logging in...' : 'Continue'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Register')}
      >
        <Text style={styles.buttonText}>Create Account</Text>
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

export default LoginScreen;