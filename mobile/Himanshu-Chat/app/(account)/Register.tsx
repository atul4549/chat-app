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

const RegisterScreen = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleContinue = () => {
    router.push('PermissionRequestPage');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Unique Id"
          value={uniqueId}
          onChangeText={setUniqueId}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="zohomail / gmail (optional)"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
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
        onPress={() => router.push('login')}
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