import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from "expo-router";
import BottomNavigationBar from '../../components/BottomNavigationBar'
const { width: SCREEN_WIDTH } = Dimensions.get('window');

import styles from './StatusListStyle';

const StatusList = () => {
  const navigation = useRouter()
  const [myStatuses, setMyStatuses] = useState([
    {
      id: 'my1',
      type: 'text',
      caption: 'Happy Friday! 🎉',
      backgroundColor: '#075E54',
      textColor: '#FFFFFF',
      views: 12,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      seen: false,
    },
    {
      id: 'my2',
      type: 'photo',
      image: null,
      caption: 'Morning coffee ☕',
      views: 8,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
      seen: false,
    },
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: null,
      statuses: [
        {
          id: 's1',
          type: 'text',
          caption: 'At the beach 🏖️',
          backgroundColor: '#34B7F1',
          textColor: '#FFFFFF',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          seen: false,
        },
        {
          id: 's2',
          type: 'photo',
          image: null,
          caption: 'Sunset view',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          seen: false,
        },
      ],
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: null,
      statuses: [
        {
          id: 's3',
          type: 'text',
          caption: 'New project launch! 🚀',
          backgroundColor: '#FF6B6B',
          textColor: '#FFFFFF',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          seen: false,
        },
      ],
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Carol Williams',
      avatar: null,
      statuses: [
        {
          id: 's4',
          type: 'photo',
          image: null,
          caption: 'Weekend vibes',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          seen: true,
        },
      ],
      lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ]);

  const [viewedUpdates, setViewedUpdates] = useState([
    {
      id: '4',
      name: 'David Brown',
      avatar: null,
      statuses: [
        {
          id: 's5',
          type: 'photo',
          image: null,
          caption: 'Work hard, play hard',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          seen: true,
        },
      ],
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      name: 'Eva Martinez',
      avatar: null,
      statuses: [
        {
          id: 's6',
          type: 'text',
          caption: 'Good morning! ☀️',
          backgroundColor: '#FFD93D',
          textColor: '#000000',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          seen: true,
        },
      ],
      lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      name: 'Frank Wilson',
      avatar: null,
      statuses: [
        {
          id: 's7',
          type: 'text',
          caption: 'Reading a great book 📚',
          backgroundColor: '#6C5CE7',
          textColor: '#FFFFFF',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          seen: true,
        },
      ],
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [mutedUpdates, setMutedUpdates] = useState([
    {
      id: '7',
      name: 'Grace Lee',
      avatar: null,
      statuses: [
        {
          id: 's8',
          type: 'photo',
          image: null,
          caption: 'Travel diaries ✈️',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          seen: true,
        },
      ],
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const handleMyStatusPress = () => {
    navigation.push({
      pathname:'StatusViewer', 
      params: { 
        userId: 'me', 
        statuses: myStatuses,
        userName: 'My Status'
    }});
  };
  // const handleChatPress = (chat: Chat) => {
  //   console.log(chat)
  //   router.push({
  //     pathname: "/chat/[id]",
  //     params: {
  //       avatar: chat.avatar,
  //       id: chat.id,
  //       isOnline: chat.isOnline,
  //       lastMessage: chat.lastMessage,
  //       name: chat.name,
  //       time: chat.time,
  //       unread: chat.unread
  //       // chat,
  //       // id: chat._id,
  //       // participantId: chat.participant._id,
  //       // name: chat.participant.name,
  //       // avatar: chat.participant.avatar,
  //     },
  //   });
  // };


  const handleStatusPress = (user) => {
    // Mark statuses as seen
    const updatedStatuses = user.statuses.map(s => ({ ...s, seen: true }));
    
    navigation.navigate('StatusViewer', {
      userId: user.id,
      statuses: updatedStatuses,
      userName: user.name,
    });
  };

  const handleCreateStatus = () => {
    navigation.navigate('CreateStatus');
  };

  const getStatusPreview = (status) => {
    if (status.type === 'text') {
      return {
        backgroundColor: status.backgroundColor,
        text: status.caption?.substring(0, 30) + (status.caption?.length > 30 ? '...' : ''),
        textColor: status.textColor,
      };
    } else if (status.type === 'photo') {
      return {
        backgroundColor: '#E0E0E0',
        icon: 'image-outline',
      };
    }
    return null;
  };

  const renderMyStatus = () => (
    <TouchableOpacity
      style={styles.myStatusContainer}
      onPress={handleMyStatusPress}
      activeOpacity={0.7}
    >
      <View style={styles.myStatusLeft}>
        <View style={styles.myStatusAvatarContainer}>
          <View style={styles.myStatusAvatar}>
            <Icon name="person" size={30} color="#fff" />
          </View>
          {myStatuses.length > 0 ? (
            <View style={styles.addStatusBadge}>
              <Icon name="add" size={16} color="#fff" />
            </View>
          ) : (
            <View style={styles.addStatusBadge}>
              <Icon name="add" size={16} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.myStatusInfo}>
          <Text style={styles.myStatusTitle}>My Status</Text>
          <Text style={styles.myStatusSubtitle}>
            {myStatuses.length > 0
              ? `Tap to view your status updates`
              : 'Tap to add status update'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.createStatusButton}
        onPress={handleCreateStatus}
      >
        <Icon name="camera-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderStatusRow = (user, showBorder = false) => {
    const latestStatus = user.statuses[user.statuses.length - 1];
    const hasUnseen = user.statuses.some(s => !s.seen);
    const preview = getStatusPreview(latestStatus);
    
    return (
      <TouchableOpacity
        key={user.id}
        style={[styles.statusRow, showBorder && styles.statusRowBorder]}
        onPress={() => handleStatusPress(user)}
        activeOpacity={0.7}
      >
        <View style={styles.statusAvatarContainer}>
          <View
            style={[
              styles.statusAvatarRing,
              hasUnseen ? styles.statusAvatarRingUnseen : styles.statusAvatarRingSeen,
            ]}
          >
            {preview?.backgroundColor ? (
              <View
                style={[
                  styles.statusPreview,
                  { backgroundColor: preview.backgroundColor },
                ]}
              >
                {preview.icon ? (
                  <Icon name={preview.icon} size={20} color="#fff" />
                ) : (
                  <Text
                    style={[styles.statusPreviewText, { color: preview.textColor }]}
                    numberOfLines={2}
                  >
                    {preview.text}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.statusAvatar}>
                <Text style={styles.statusAvatarText}>
                  {user.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          {user.statuses.length > 1 && (
            <View style={styles.multipleStatusBadge}>
              <Text style={styles.multipleStatusText}>
                {user.statuses.length}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statusInfo}>
          <Text style={styles.statusName}>{user.name}</Text>
          <Text style={styles.statusTime}>{formatTime(user.lastUpdated)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data, showBorder = false) => {
    if (!data || data.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((user) => renderStatusRow(user, showBorder))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.back()}
          style={styles.headerButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleCreateStatus}
        >
          <Icon name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Status */}
        {renderMyStatus()}

        {/* Recent Updates */}
        {renderSection('Recent Updates', recentUpdates, true)}

        {/* Viewed Updates */}
        {renderSection('Viewed Updates', viewedUpdates, true)}

        {/* Muted Updates */}
        {mutedUpdates.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.mutedHeader}
              onPress={() => {
                // Toggle muted section visibility
              }}
            >
              <Text style={styles.sectionTitle}>Muted Status Updates</Text>
              <Icon name="chevron-down-outline" size={20} color="#999" />
            </TouchableOpacity>
            {mutedUpdates.map((user) => renderStatusRow(user, true))}
          </View>
        )}

        {/* Empty State */}
        {recentUpdates.length === 0 && viewedUpdates.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Status Updates</Text>
            <Text style={styles.emptyStateText}>
              Status updates from your contacts will appear here
            </Text>
            <TouchableOpacity
              style={styles.createFirstStatusButton}
              onPress={handleCreateStatus}
            >
              <Text style={styles.createFirstStatusText}>Create Your First Status</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Create Status FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateStatus}
          activeOpacity={0.8}
        >
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary]}
          onPress={handleCreateStatus}
          activeOpacity={0.8}
        >
          <Icon name="create" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <BottomNavigationBar/>
    </View>
  );
};

export default StatusList;