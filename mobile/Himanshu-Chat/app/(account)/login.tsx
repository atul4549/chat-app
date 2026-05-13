import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
import styles from './authStyle';

const LoginScreen = () => {
  const navigation = useRouter();
  const router = useRouter();
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    // Handle login logic here
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
          value={uniqueId}
          onChangeText={setUniqueId}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('Register')}
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