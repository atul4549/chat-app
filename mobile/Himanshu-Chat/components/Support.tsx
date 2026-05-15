import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Share,
  Clipboard,
} from 'react-native';

export default function SupportScreen() {
  const [supportType, setSupportType] = useState('general');
  const [message, setMessage] = useState('');
  const supportEmail = 'atul4545@zohomail.in';

  const handleSendEmail = () => {
    const subject = `Support Request - ${supportType.toUpperCase()} - Chat App`;
    const body = `Support Type: ${supportType}
Message: ${message}

---
User Information:
App Version: 1.0.0
Device: ${Platform.OS} ${Platform.Version}
---

Please respond to this email. Thank you!`;

    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No email client found');
      }
    });
  };

  const handleCopyEmail = () => {
    Clipboard.setString(supportEmail);
    Alert.alert('Copied!', 'Email address copied to clipboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Center</Text>
        <Text style={styles.headerSubtitle}>We're here to help you 24/7</Text>
      </View>

      {/* Email Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📧 Email Support</Text>
        <TouchableOpacity onPress={handleCopyEmail} style={styles.emailRow}>
          <Text style={styles.emailLabel}>Email us at:</Text>
          <Text style={styles.emailValue}>atul4545@zohomail.in</Text>
          <Text style={styles.copyIcon}>📋</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.emailButton}
          onPress={() => Linking.openURL(`mailto:${supportEmail}`)}>
          <Text style={styles.emailButtonText}>Send Email Now</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Support Types */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Support Options</Text>
        
        <TouchableOpacity 
          style={styles.quickOption}
          onPress={() => {
            const url = `mailto:${supportEmail}?subject=Account Issue - Chat App`;
            Linking.openURL(url);
          }}>
          <Text style={styles.quickOptionIcon}>🔐</Text>
          <View style={styles.quickOptionContent}>
            <Text style={styles.quickOptionTitle}>Account Issues</Text>
            <Text style={styles.quickOptionDesc}>Login, registration, or profile problems</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickOption}
          onPress={() => {
            const url = `mailto:${supportEmail}?subject=Payment Support - Chat App`;
            Linking.openURL(url);
          }}>
          <Text style={styles.quickOptionIcon}>💳</Text>
          <View style={styles.quickOptionContent}>
            <Text style={styles.quickOptionTitle}>Payment Support</Text>
            <Text style={styles.quickOptionDesc}>QR code, transactions, or payment issues</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickOption}
          onPress={() => {
            const url = `mailto:${supportEmail}?subject=Technical Support - Chat App`;
            Linking.openURL(url);
          }}>
          <Text style={styles.quickOptionIcon}>⚙️</Text>
          <View style={styles.quickOptionContent}>
            <Text style={styles.quickOptionTitle}>Technical Support</Text>
            <Text style={styles.quickOptionDesc}>Bugs, errors, or app functionality</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickOption}
          onPress={() => {
            const url = `mailto:${supportEmail}?subject=Feature Request - Chat App`;
            Linking.openURL(url);
          }}>
          <Text style={styles.quickOptionIcon}>💡</Text>
          <View style={styles.quickOptionContent}>
            <Text style={styles.quickOptionTitle}>Feature Request</Text>
            <Text style={styles.quickOptionDesc}>Suggest new features or improvements</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Send Detailed Message</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Support Type</Text>
          <View style={styles.pickerContainer}>
            {['general', 'technical', 'payment', 'account', 'feature'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.pickerOption, supportType === type && styles.pickerOptionActive]}
                onPress={() => setSupportType(type)}>
                <Text style={[styles.pickerText, supportType === type && styles.pickerTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Describe your issue in detail..."
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Alternative Contact Methods */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Other Support Channels</Text>
        
        <TouchableOpacity 
          style={styles.alternativeOption}
          onPress={() => Linking.openURL('https://wa.me/yourphonenumber')}>
          <Text style={styles.alternativeIcon}>💬</Text>
          <Text style={styles.alternativeText}>WhatsApp Support</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.alternativeOption}
          onPress={() => Linking.openURL('https://t.me/yourusername')}>
          <Text style={styles.alternativeIcon}>📱</Text>
          <Text style={styles.alternativeText}>Telegram Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007aff',
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  emailLabel: {
    fontSize: 14,
    color: '#666',
  },
  emailValue: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  copyIcon: {
    fontSize: 18,
  },
  emailButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  quickOptionContent: {
    flex: 1,
  },
  quickOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickOptionDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionActive: {
    backgroundColor: '#007aff',
  },
  pickerText: {
    fontSize: 12,
    color: '#666',
  },
  pickerTextActive: {
    color: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  sendButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alternativeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  alternativeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alternativeText: {
    fontSize: 14,
    color: '#007aff',
  },
});