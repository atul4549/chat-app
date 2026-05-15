import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

export default function EmailSupportLink() {
  const handleEmailPress = async () => {
    const email = 'atul4545@zohomail.in';
    const subject = 'Support Request - Chat App';
    const body = `Hello Team,

I need support regarding:

[Please describe your issue here]

User Details:
- Username: 
- App Version: 
- Device: 

Thank you.`;

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Email Client Not Found',
          'Please configure an email app on your device or contact us directly at: atul4545@zohomail.in',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  return (
    <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
      <Text style={styles.emailIcon}>📧</Text>
      <View style={styles.emailContent}>
        <Text style={styles.emailTitle}>Support & Feedback</Text>
        <Text style={styles.emailAddress}>atul4545@zohomail.in</Text>
        <Text style={styles.emailDescription}>Click to send us an email</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  emailContent: {
    flex: 1,
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emailAddress: {
    fontSize: 14,
    color: '#007aff',
    marginTop: 2,
  },
  emailDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
});