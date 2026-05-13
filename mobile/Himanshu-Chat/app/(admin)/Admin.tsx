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
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useChatStore from '../../store/chatStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import {useRouter} from 'expo-router'
import styles from './adminStyle'
// ==================== ADMIN PAGE COMPONENT ====================
const AdminPage = () => {
  const navigation = useRouter()
  const { contacts } = useChatStore();
  
  // Notification State
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('general'); // 'general', 'promotional', 'update', 'alert'
  const [targetAudience, setTargetAudience] = useState('all'); // 'all', 'active', 'inactive'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [includeImage, setIncludeImage] = useState(false);
  const [notificationImage, setNotificationImage] = useState(null);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  
  // Analytics State
  const [notificationsSent, setNotificationsSent] = useState(245);
  const [activeUsers, setActiveUsers] = useState(1234);
  const [totalUsers, setTotalUsers] = useState(5678);
  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: '1',
      title: 'Welcome New Users',
      message: 'Welcome to our chat app! Start connecting with friends.',
      type: 'general',
      sentAt: '2024-01-15 10:30 AM',
      recipients: 5678,
      opened: 3456,
    },
    {
      id: '2',
      title: 'New Feature Update',
      message: 'We have added end-to-end encryption for secure messaging.',
      type: 'update',
      sentAt: '2024-01-14 02:15 PM',
      recipients: 5678,
      opened: 4123,
    },
    {
      id: '3',
      title: 'Holiday Special',
      message: 'Enjoy unlimited messaging this holiday season!',
      type: 'promotional',
      sentAt: '2024-01-13 09:00 AM',
      recipients: 5678,
      opened: 3890,
    },
  ]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('compose'); // 'compose', 'history', 'analytics'
  const [showPreview, setShowPreview] = useState(false);

  // Dummy users for selection
  const allUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'active' },
    { id: '3', name: 'Carol Williams', email: 'carol@example.com', status: 'inactive' },
    { id: '4', name: 'David Brown', email: 'david@example.com', status: 'active' },
    { id: '5', name: 'Eva Martinez', email: 'eva@example.com', status: 'active' },
    { id: '6', name: 'Frank Wilson', email: 'frank@example.com', status: 'inactive' },
  ];

  const notificationTypes = [
    { id: 'general', label: 'General', icon: 'notifications-outline', color: '#1976D2' },
    { id: 'promotional', label: 'Promotional', icon: 'pricetag-outline', color: '#F57C00' },
    { id: 'update', label: 'Update', icon: 'refresh-outline', color: '#4CAF50' },
    { id: 'alert', label: 'Alert', icon: 'warning-outline', color: '#F44336' },
  ];

  const audienceTypes = [
    { id: 'all', label: 'All Users', count: totalUsers },
    { id: 'active', label: 'Active Users', count: activeUsers },
    { id: 'inactive', label: 'Inactive Users', count: totalUsers - activeUsers },
    { id: 'selected', label: 'Selected Users', count: selectedUsers.length },
  ];

  const handleSendNotification = () => {
    if (!notificationTitle.trim()) {
      Alert.alert('Error', 'Please enter a notification title');
      return;
    }
    if (!notificationMessage.trim()) {
      Alert.alert('Error', 'Please enter a notification message');
      return;
    }

    if (targetAudience === 'selected' && selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user');
      return;
    }

    Alert.alert(
      'Send Notification',
      `Are you sure you want to send this notification to ${getRecipientCount()} users?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            setIsLoading(true);
            // Simulate sending notification
            setTimeout(() => {
              const newNotification = {
                id: Date.now().toString(),
                title: notificationTitle,
                message: notificationMessage,
                type: notificationType,
                sentAt: new Date().toLocaleString(),
                recipients: getRecipientCount(),
                opened: 0,
              };

              setNotificationHistory([newNotification, ...notificationHistory]);
              setNotificationsSent(prev => prev + 1);
              
              // Reset form
              setNotificationTitle('');
              setNotificationMessage('');
              setNotificationType('general');
              setTargetAudience('all');
              setSelectedUsers([]);
              setIncludeImage(false);
              setNotificationImage(null);
              setIsScheduled(false);
              setScheduledTime(null);
              setIsLoading(false);

              Alert.alert('Success', 'Notification sent successfully!');
            }, 2000);
          },
        },
      ]
    );
  };

  const handleScheduleNotification = () => {
    // In a real app, implement date picker for scheduling
    Alert.alert(
      'Schedule Notification',
      'Select date and time for scheduling',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Schedule',
          onPress: () => {
            setScheduledTime(new Date(Date.now() + 3600000).toLocaleString());
            setIsScheduled(true);
            Alert.alert('Scheduled', 'Notification scheduled for later');
          },
        },
      ]
    );
  };

  const getRecipientCount = () => {
    switch (targetAudience) {
      case 'all': return totalUsers;
      case 'active': return activeUsers;
      case 'inactive': return totalUsers - activeUsers;
      case 'selected': return selectedUsers.length;
      default: return 0;
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotificationHistory(prev => prev.filter(n => n.id !== id));
          },
        },
      ]
    );
  };

  const renderComposeTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Analytics Cards */}
      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Icon name="notifications" size={24} color="#1976D2" />
          <Text style={styles.analyticsNumber}>{notificationsSent}</Text>
          <Text style={styles.analyticsLabel}>Sent</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Icon name="people" size={24} color="#4CAF50" />
          <Text style={styles.analyticsNumber}>{activeUsers}</Text>
          <Text style={styles.analyticsLabel}>Active Users</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Icon name="stats-chart" size={24} color="#F57C00" />
          <Text style={styles.analyticsNumber}>
            {notificationHistory.length > 0
              ? Math.round((notificationHistory.reduce((sum, n) => sum + n.opened, 0) /
                  notificationHistory.reduce((sum, n) => sum + n.recipients, 0)) * 100)
              : 0}%
          </Text>
          <Text style={styles.analyticsLabel}>Open Rate</Text>
        </View>
      </View>

      {/* Notification Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Type</Text>
        <View style={styles.typeContainer}>
          {notificationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                notificationType === type.id && { backgroundColor: type.color },
              ]}
              onPress={() => setNotificationType(type.id)}
            >
              <Icon
                name={type.icon}
                size={20}
                color={notificationType === type.id ? '#fff' : type.color}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  notificationType === type.id && styles.typeButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Target Audience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target Audience</Text>
        {audienceTypes.map((audience) => (
          <TouchableOpacity
            key={audience.id}
            style={[
              styles.audienceOption,
              targetAudience === audience.id && styles.audienceOptionSelected,
            ]}
            onPress={() => {
              setTargetAudience(audience.id);
              if (audience.id === 'selected') {
                setShowUserSelector(true);
              }
            }}
          >
            <View style={styles.audienceLeft}>
              <View style={styles.radio}>
                {targetAudience === audience.id && (
                  <View style={styles.radioFill} />
                )}
              </View>
              <Text style={styles.audienceLabel}>{audience.label}</Text>
            </View>
            <Text style={styles.audienceCount}>{audience.count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Content</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter notification title"
            placeholderTextColor="#999"
            value={notificationTitle}
            onChangeText={setNotificationTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Message *</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Enter notification message"
            placeholderTextColor="#999"
            value={notificationMessage}
            onChangeText={setNotificationMessage}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{notificationMessage.length}/500</Text>
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionLabel}>Include Image</Text>
            <Text style={styles.optionDescription}>
              Add an image to your notification
            </Text>
          </View>
          <Switch
            value={includeImage}
            onValueChange={setIncludeImage}
            trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
            thumbColor={includeImage ? '#075E54' : '#f4f3f4'}
          />
        </View>

        {includeImage && (
          <TouchableOpacity style={styles.uploadButton}>
            <Icon name="image-outline" size={24} color="#075E54" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.sendButton, (!notificationTitle.trim() || !notificationMessage.trim()) && styles.sendButtonDisabled]}
          onPress={handleSendNotification}
          disabled={!notificationTitle.trim() || !notificationMessage.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Now</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleNotification}
        >
          <Icon name="time-outline" size={20} color="#075E54" />
          <Text style={styles.scheduleButtonText}>
            {isScheduled ? `Scheduled for ${scheduledTime}` : 'Schedule for Later'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <FlatList
      data={notificationHistory}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.historyList}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Icon name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No notifications sent yet</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <View style={[styles.historyTypeBadge, { backgroundColor: getTypeColor(item.type) }]}>
              <Text style={styles.historyTypeText}>{item.type}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
              <Icon name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historyMessage} numberOfLines={2}>
            {item.message}
          </Text>
          
          <View style={styles.historyStats}>
            <View style={styles.historyStat}>
              <Icon name="send-outline" size={14} color="#666" />
              <Text style={styles.historyStatText}>
                Sent to {item.recipients} users
              </Text>
            </View>
            <View style={styles.historyStat}>
              <Icon name="eye-outline" size={14} color="#666" />
              <Text style={styles.historyStatText}>
                {item.opened} opened ({Math.round((item.opened / item.recipients) * 100)}%)
              </Text>
            </View>
          </View>
          
          <Text style={styles.historyTime}>Sent at {item.sentAt}</Text>
        </View>
      )}
    />
  );

  const renderAnalyticsTab = () => (
    <ScrollView>
      <View style={styles.analyticsDetailed}>
        <Text style={styles.analyticsTitle}>Notification Analytics</Text>
        
        {/* Performance Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{notificationsSent}</Text>
            <Text style={styles.metricLabel}>Total Sent</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>
              {notificationHistory.reduce((sum, n) => sum + n.opened, 0)}
            </Text>
            <Text style={styles.metricLabel}>Total Opens</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{activeUsers}</Text>
            <Text style={styles.metricLabel}>Active Users</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{totalUsers}</Text>
            <Text style={styles.metricLabel}>Total Users</Text>
          </View>
        </View>

        {/* Type Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Notifications by Type</Text>
          {notificationTypes.map((type) => {
            const count = notificationHistory.filter(n => n.type === type.id).length;
            const percentage = notificationsSent > 0 ? (count / notificationsSent) * 100 : 0;
            
            return (
              <View key={type.id} style={styles.chartRow}>
                <View style={styles.chartInfo}>
                  <View style={[styles.chartDot, { backgroundColor: type.color }]} />
                  <Text style={styles.chartLabel}>{type.label}</Text>
                </View>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      { width: `${percentage}%`, backgroundColor: type.color },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  const getTypeColor = (type) => {
    const typeObj = notificationTypes.find(t => t.id === type);
    return typeObj ? typeObj.color : '#999';
  };

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
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'compose', label: 'Compose', icon: 'create-outline' },
          { id: 'history', label: 'History', icon: 'time-outline' },
          { id: 'analytics', label: 'Analytics', icon: 'stats-chart-outline' },
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
        {activeTab === 'compose' && renderComposeTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </View>

      {/* User Selection Modal */}
      <Modal
        visible={showUserSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.userModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Users</Text>
              <TouchableOpacity onPress={() => setShowUserSelector(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.selectedCount}>
              {selectedUsers.length} users selected
            </Text>

            <FlatList
              data={allUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedUsers.find(u => u.id === item.id);
                return (
                  <TouchableOpacity
                    style={styles.userSelectItem}
                    onPress={() => toggleUserSelection(item)}
                  >
                    <View style={styles.userSelectInfo}>
                      <View style={styles.userSelectAvatar}>
                        <Text style={styles.userSelectAvatarText}>
                          {item.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.userSelectName}>{item.name}</Text>
                        <Text style={styles.userSelectEmail}>{item.email}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Icon name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowUserSelector(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminPage