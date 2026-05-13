import React, { useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useChatStore from '../../store/chatStore';
import {useAuthStore} from '../../store/useAuthStore';
import BottomNavigationBar from '../../components/BottomNavigationBar';
import { useRouter } from "expo-router";
import styles from './ChatListStyle'
const ChatListScreen = () => {
  const router = useRouter();
  // const { chats, user } = useChatStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
const chats = users
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // if (isUsersLoading) return '<SidebarSkeleton />';

  const [searchQuery, setSearchQuery] = useState('');

  // Admin Talk data - special chat for all registered users
  const adminTalk = {
    id: 'admin_talk',
    name: '📢 Admin Talk',
    description: 'Community chat with admin - Everyone can participate',
    lastMessage: 'Welcome to Admin Talk! Feel free to share your thoughts.',
    time: 'Just now',
    unread: 3,
    avatar: null,
    isOnline: true,
    isGroup: true,
    isAdminTalk: true,
    adminId: '1', // Admin user ID
    participants: 24, // Number of participants
    messages: [
      {
        id: '1',
        text: 'Welcome to Admin Talk! Everyone can participate.',
        userId: '1',
        userName: 'Admin',
        time: '10:00 AM',
        isAdmin: true,
      },
      {
        id: '2',
        text: 'Thanks for adding me to this group!',
        userId: '2',
        userName: 'Alice Johnson',
        time: '10:05 AM',
        isAdmin: false,
      },
      {
        id: '3',
        text: 'When is the next community meeting?',
        userId: '3',
        userName: 'Bob Smith',
        time: '10:10 AM',
        isAdmin: false,
      },
    ],
  };

  // Combine regular chats with admin talk
  const allChats = [adminTalk, ...chats];

  const filteredChats = allChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    if (chat.isAdminTalk) {
      // Navigate to Admin Talk chat screen
      router.push({
        pathname: "/admin-talk/[id]",
        params: {
          id: chat.id,
          name: chat.name,
          isAdminTalk: true,
          adminId: chat.adminId,
          participants: chat.participants,
        },
      });
    } else {
      router.push({
        pathname: "/chat/[id]",
        params: {
          avatar: chat.avatar,
          id: chat.id,
          isOnline: chat.isOnline,
          lastMessage: chat.lastMessage,
          name: chat.name,
          time: chat.time,
          unread: chat.unread
        },
      });
    }
  };

  const handleAdminTalkPress = () => {
    Alert.alert(
      "Admin Talk",
      "Join the community chat where everyone can participate and interact with the admin. Share your ideas, ask questions, and connect with others!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Join Now", onPress: () => handleChatPress(adminTalk) }
      ]
    );
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.chatItem, item.isAdminTalk && styles.adminTalkItem]}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.avatarPlaceholder, 
            item.isGroup && styles.groupAvatar,
            item.isAdminTalk && styles.adminTalkAvatar
          ]}>
            <Text style={styles.avatarText}>
              {item.isAdminTalk ? '👑' : (item.isGroup ? '👥' : item.name.charAt(0))}
            </Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineDot} />}
        {item.isAdminTalk && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.isAdminTalk && styles.adminTalkName]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.isAdminTalk && '👑 '}{item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unread > 99 ? '99+' : item.unread}
              </Text>
            </View>
          )}
        </View>
        {item.isAdminTalk && item.participants && (
          <View style={styles.participantsInfo}>
            <Icon name="people-outline" size={12} color="#999" />
            <Text style={styles.participantsText}>{item.participants} participants</Text>
          </View>
        )}
      </View>
      
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderAdminTalkSection = () => (
    <View style={styles.adminTalkSection}>
      <View style={styles.adminTalkHeader}>
        <View style={styles.adminTalkIconContainer}>
          <Icon name="chatbubble-ellipses" size={28} color="#075E54" />
        </View>
        <View style={styles.adminTalkInfo}>
          <Text style={styles.adminTalkTitle}>Community Chat with Admin</Text>
          <Text style={styles.adminTalkDescription}>
            Join the official community chat where all registered members can participate and talk directly with the admin. Share your ideas, ask questions, and connect with others!
          </Text>
          <View style={styles.adminTalkFeatures}>
            <View style={styles.featureItem}>
              <Icon name="people" size={14} color="#075E54" />
              <Text style={styles.featureText}>24 members online</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="shield-checkmark" size={14} color="#075E54" />
              <Text style={styles.featureText}>Admin moderated</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="chatbubbles" size={14} color="#075E54" />
              <Text style={styles.featureText}>Open discussions</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={handleAdminTalkPress}
          >
            <Text style={styles.joinButtonText}>Join Community Chat →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatApp</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="camera-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push('AccountSettings')}
          >
            <Icon name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Admin Talk Section */}
      {/* {renderAdminTalkSection()} */}

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={
        //   <View style={styles.chatListHeader}>
        //     <Text style={styles.sectionTitle}>Your Chats</Text>
        //   </View>
        // }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('new-chat')}
        activeOpacity={0.8}
      >
        <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar/>
    </View>
  );
};


export default ChatListScreen;