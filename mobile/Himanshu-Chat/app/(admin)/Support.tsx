import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList,
  Switch,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';

import styles from './adminStyle'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useChatStore from '../../store/chatStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import {useRouter} from 'expo-router'

// import {useRouter} from 'expo-router'
// ==================== SUPPORT PAGE COMPONENT ====================
const SupportPage = () => {
    const navigation = useRouter()
    const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'faq', 'report'
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [ticketHistory, setTicketHistory] = useState([
      {
        id: '1',
        subject: 'App crashing on startup',
        category: 'technical',
        status: 'resolved',
        createdAt: '2024-01-15',
        lastUpdated: '2024-01-16',
        messages: 3,
      },
      {
        id: '2',
        subject: 'How to enable encryption?',
        category: 'general',
        status: 'open',
        createdAt: '2024-01-14',
        lastUpdated: '2024-01-15',
        messages: 2,
      },
    ]);
  
    const categories = [
      { id: 'general', label: 'General Inquiry', icon: 'help-circle-outline' },
      { id: 'technical', label: 'Technical Issue', icon: 'construct-outline' },
      { id: 'billing', label: 'Billing Question', icon: 'card-outline' },
      { id: 'feature', label: 'Feature Request', icon: 'bulb-outline' },
      { id: 'privacy', label: 'Privacy Concern', icon: 'shield-checkmark-outline' },
    ];
  
    const faqList = [
      {
        question: 'How do I enable end-to-end encryption?',
        answer: 'Go to Profile > Settings > Encryption and set your encryption keys.',
      },
      {
        question: 'How can I connect with other users?',
        answer: 'Go to the Connections tab on your profile and send connection requests.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption and you can add additional encryption keys.',
      },
      {
        question: 'How do I report a problem?',
        answer: 'Use the Contact tab to submit a support ticket, or email support directly.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, go to Profile > Settings > Danger Zone > Delete Account.',
      },
      {
        question: 'How many devices can I use?',
        answer: 'You can use your account on multiple devices simultaneously.',
      },
    ];
  
    const handleSendEmail = () => {
      if (!subject.trim()) {
        Alert.alert('Error', 'Please enter a subject');
        return;
      }
      if (!message.trim()) {
        Alert.alert('Error', 'Please enter your message');
        return;
      }
  
      setIsLoading(true);
  
      // Simulate sending email
      setTimeout(() => {
        const newTicket = {
          id: Date.now().toString(),
          subject,
          category,
          status: 'open',
          createdAt: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          messages: 1,
        };
  
        setTicketHistory([newTicket, ...ticketHistory]);
        setSubject('');
        setMessage('');
        setIsLoading(false);
  
        const emailUrl = `mailto:atul4545@zohomail.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        Alert.alert(
          'Send Email',
          'Do you want to send this via email?',
          [
            {
              text: 'Send In-App',
              onPress: () => {
                Alert.alert(
                  'Ticket Created',
                  `Your support ticket has been created. We'll respond at atul4545@zohomail.in`,
                  [{ text: 'OK' }]
                );
              },
            },
            {
              text: 'Open Email',
              onPress: () => {
                Linking.openURL(emailUrl).catch(() => {
                  Alert.alert('Error', 'Could not open email client');
                });
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }, 1500);
    };
  
    const handleReportProblem = () => {
      Alert.alert(
        'Report a Problem',
        'Please describe the issue you are experiencing',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Next',
            onPress: () => {
              // Navigate to detailed report form
              setActiveTab('contact');
              setCategory('technical');
            },
          },
        ]
      );
    };
  
    const renderContactTab = () => (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Direct Email Section */}
        <View style={styles.supportSection}>
          <View style={styles.emailCard}>
            <Icon name="mail-outline" size={40} color="#075E54" />
            <Text style={styles.emailTitle}>Email Support</Text>
            <Text style={styles.emailAddress}>atul4545@zohomail.in</Text>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => {
                Linking.openURL('mailto:atul4545@zohomail.in');
              }}
            >
              <Icon name="mail" size={20} color="#fff" />
              <Text style={styles.emailButtonText}>Send Email Directly</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Contact Form */}
        <View style={styles.supportSection}>
          <Text style={styles.supportSectionTitle}>Submit a Ticket</Text>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Icon
                    name={cat.icon}
                    size={16}
                    color={category === cat.id ? '#fff' : '#075E54'}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat.id && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              maxLength={1000}
            />
            <Text style={styles.charCount}>{message.length}/1000</Text>
          </View>
  
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!subject.trim() || !message.trim()) && styles.submitButtonDisabled,
            ]}
            onPress={handleSendEmail}
            disabled={!subject.trim() || !message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Ticket</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
  
        {/* Quick Actions */}
        <View style={styles.supportSection}>
          <Text style={styles.supportSectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleReportProblem}
          >
            <Icon name="warning-outline" size={24} color="#F44336" />
            <View style={styles.quickActionInfo}>
              <Text style={styles.quickActionTitle}>Report a Problem</Text>
              <Text style={styles.quickActionDescription}>
                Something isn't working? Let us know
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Linking.openURL('tel:+1234567890')}
          >
            <Icon name="call-outline" size={24} color="#4CAF50" />
            <View style={styles.quickActionInfo}>
              <Text style={styles.quickActionTitle}>Call Support</Text>
              <Text style={styles.quickActionDescription}>
                Available Mon-Fri, 9AM-6PM
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
  
        {/* Ticket History */}
        <View style={styles.supportSection}>
          <Text style={styles.supportSectionTitle}>Your Tickets</Text>
          {ticketHistory.map((ticket) => (
            <TouchableOpacity key={ticket.id} style={styles.ticketItem}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                <View
                  style={[
                    styles.ticketStatus,
                    ticket.status === 'open'
                      ? styles.statusOpen
                      : styles.statusResolved,
                  ]}
                >
                  <Text
                    style={[
                      styles.ticketStatusText,
                      ticket.status === 'open'
                        ? styles.statusOpenText
                        : styles.statusResolvedText,
                    ]}
                  >
                    {ticket.status}
                  </Text>
                </View>
              </View>
              <View style={styles.ticketMeta}>
                <Text style={styles.ticketDate}>Created: {ticket.createdAt}</Text>
                <Text style={styles.ticketMessages}>
                  {ticket.messages} messages
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  
    const renderFAQTab = () => (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {faqList.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <View style={styles.faqQuestionRow}>
                <Icon name="help-circle" size={20} color="#075E54" />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  
    const renderReportTab = () => (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Report an Issue</Text>
          <Text style={styles.reportDescription}>
            Please select the type of issue you're experiencing
          </Text>
  
          {[
            { id: 'bug', title: 'Bug Report', icon: 'bug-outline', color: '#F44336' },
            { id: 'abuse', title: 'Abuse or Harassment', icon: 'shield-outline', color: '#FF9800' },
            { id: 'spam', title: 'Spam', icon: 'mail-unread-outline', color: '#9C27B0' },
            { id: 'other', title: 'Other Issue', icon: 'ellipsis-horizontal-outline', color: '#607D8B' },
          ].map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={styles.reportOption}
              onPress={() => {
                setCategory('technical');
                setSubject(issue.title);
                setActiveTab('contact');
              }}
            >
              <Icon name={issue.icon} size={24} color={issue.color} />
              <Text style={styles.reportOptionText}>{issue.title}</Text>
              <Icon name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
  
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL('tel:911')}
          >
            <Icon name="alert-circle" size={24} color="#fff" />
            <Text style={styles.emergencyText}>Emergency? Call 911</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.back()}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
  
        {/* Tabs */}
        <View style={styles.tabs}>
          {[
            { id: 'contact', label: 'Contact', icon: 'mail-outline' },
            { id: 'faq', label: 'FAQ', icon: 'help-circle-outline' },
            { id: 'report', label: 'Report', icon: 'warning-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#075E54' : '#999'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'contact' && renderContactTab()}
          {activeTab === 'faq' && renderFAQTab()}
          {activeTab === 'report' && renderReportTab()}
        </View>
      </View>
    );
  };

  export default SupportPage
