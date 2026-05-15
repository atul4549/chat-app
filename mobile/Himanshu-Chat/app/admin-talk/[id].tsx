import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style'
const AdminTalkScreen = () => {
  const router = useRouter();
  const { id, name, adminId, participants } = useLocalSearchParams();
  const flatListRef = useRef(null);
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Current user (in a real app, this would come from auth)
  const currentUser = {
    id: '2',
    name: 'Alice Johnson',
    isAdmin: false,
    avatar: null,
  };
  
  // Admin user
  const admin = {
    id: '1',
    name: 'Admin',
    isAdmin: true,
    avatar: null,
  };
  
  // Sample messages data
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Welcome to Admin Talk! This is a community chat where everyone can participate.',
      userId: '1',
      userName: 'Admin',
      userAvatar: null,
      time: '10:00 AM',
      date: 'Today',
      isAdmin: true,
      isEdited: false,
      isDeleted: false,
      replies: [],
      likes: 5,
    },
    {
      id: '2',
      text: 'Thanks for creating this space! Great initiative.',
      userId: '2',
      userName: 'Alice Johnson',
      userAvatar: null,
      time: '10:05 AM',
      date: 'Today',
      isAdmin: false,
      isEdited: false,
      isDeleted: false,
      replies: [],
      likes: 2,
    },
    {
      id: '3',
      text: 'When is the next community meeting scheduled?',
      userId: '3',
      userName: 'Bob Smith',
      userAvatar: null,
      time: '10:10 AM',
      date: 'Today',
      isAdmin: false,
      isEdited: false,
      isDeleted: false,
      replies: [
        {
          id: 'r1',
          text: 'The meeting is scheduled for next Friday at 3 PM.',
          userId: '1',
          userName: 'Admin',
          time: '10:12 AM',
        }
      ],
      likes: 3,
    },
    {
      id: '4',
      text: 'I have a suggestion for improving the app...',
      userId: '4',
      userName: 'Carol Williams',
      userAvatar: null,
      time: '10:15 AM',
      date: 'Today',
      isAdmin: false,
      isEdited: false,
      isDeleted: false,
      replies: [],
      likes: 1,
    },
    {
      id: '5',
      text: 'Great suggestion! Please share your thoughts, we value community feedback.',
      userId: '1',
      userName: 'Admin',
      userAvatar: null,
      time: '10:18 AM',
      date: 'Today',
      isAdmin: true,
      isEdited: false,
      isDeleted: false,
      replies: [],
      likes: 4,
    },
  ]);
  
  const [participantsList, setParticipantsList] = useState([
    { id: '1', name: 'Admin', isOnline: true, isAdmin: true },
    { id: '2', name: 'Alice Johnson', isOnline: true, isAdmin: false },
    { id: '3', name: 'Bob Smith', isOnline: false, isAdmin: false },
    { id: '4', name: 'Carol Williams', isOnline: true, isAdmin: false },
    { id: '5', name: 'David Brown', isOnline: false, isAdmin: false },
    { id: '6', name: 'Eva Martinez', isOnline: true, isAdmin: false },
  ]);
  
  const [showParticipants, setShowParticipants] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  
  useEffect(() => {
    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isTyping) {
        const randomUser = participantsList.find(p => p.id !== currentUser.id && p.isOnline);
        if (randomUser) {
          setTypingUsers([randomUser.name]);
          setTimeout(() => {
            setTypingUsers([]);
          }, 3000);
        }
      }
    }, 10000);
    
    return () => clearInterval(typingInterval);
  }, [isTyping]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      isAdmin: currentUser.isAdmin,
      isEdited: false,
      isDeleted: false,
      replies: [],
      likes: 0,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate admin response for demo
    if (!currentUser.isAdmin && message.toLowerCase().includes('question')) {
      setTimeout(() => {
        const adminResponse = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your question! I'll get back to you shortly.",
          userId: admin.id,
          userName: admin.name,
          userAvatar: null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          isAdmin: true,
          isEdited: false,
          isDeleted: false,
          replies: [],
          likes: 0,
        };
        setMessages(prev => [...prev, adminResponse]);
      }, 2000);
    }
  };
  
  const handleLikeMessage = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };
  
  const handleDeleteMessage = (messageId) => {
    if (currentUser.isAdmin) {
      Alert.alert(
        "Delete Message",
        "Are you sure you want to delete this message?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => {
              setMessages(messages.map(msg => 
                msg.id === messageId 
                  ? { ...msg, text: "[Message deleted by admin]", isDeleted: true }
                  : msg
              ));
            }
          }
        ]
      );
    }
  };
  
  const handlePinMessage = (messageId) => {
    if (currentUser.isAdmin) {
      Alert.alert("Success", "Message pinned to top");
      // Implement pin functionality
    }
  };
  
  const handleMuteUser = (userId) => {
    if (currentUser.isAdmin) {
      Alert.alert(
        "Mute User",
        "Are you sure you want to mute this user?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Mute", onPress: () => Alert.alert("Success", "User has been muted") }
        ]
      );
    }
  };
  
  const handleAnnouncement = () => {
    Alert.alert(
      "Make Announcement",
      "Enter your announcement message:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Post", 
          onPress: () => {
            const announcement = {
              id: Date.now().toString(),
              text: "📢 ANNOUNCEMENT: " + "Important community update!",
              userId: admin.id,
              userName: admin.name,
              userAvatar: null,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: 'Today',
              isAdmin: true,
              isEdited: false,
              isDeleted: false,
              replies: [],
              likes: 0,
            };
            setMessages([announcement, ...messages]);
          }
        }
      ]
    );
  };
  
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.userId === currentUser.id && styles.myMessageContainer,
      item.isAdmin && styles.adminMessageContainer,
      item.isDeleted && styles.deletedMessageContainer,
    ]}>
      {item.userId !== currentUser.id && (
        <View style={styles.messageAvatar}>
          {item.userAvatar ? (
            <Image source={{ uri: item.userAvatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, item.isAdmin && styles.adminAvatar]}>
              <Text style={styles.avatarText}>
                {item.isAdmin ? '👑' : item.userName.charAt(0)}
              </Text>
            </View>
          )}
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.userId === currentUser.id && styles.myMessageBubble,
        item.isAdmin && styles.adminMessageBubble,
      ]}>
        {item.userId !== currentUser.id && (
          <View style={styles.messageHeader}>
            <Text style={[
              styles.messageUserName,
              item.isAdmin && styles.adminUserName
            ]}>
              {item.userName}
              {item.isAdmin && <Text style={styles.adminBadge}> • Admin</Text>}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        
        <Text style={[
          styles.messageText,
          item.isDeleted && styles.deletedMessageText
        ]}>
          {item.text}
        </Text>
        
        {item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(reply => (
              <View key={reply.id} style={styles.replyItem}>
                <Text style={styles.replyUserName}>{reply.userName}:</Text>
                <Text style={styles.replyText}>{reply.text}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.messageActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeMessage(item.id)}
          >
            <Icon name="heart-outline" size={16} color="#999" />
            {item.likes > 0 && (
              <Text style={styles.actionCount}>{item.likes}</Text>
            )}
          </TouchableOpacity>
          
          {currentUser.isAdmin && !item.isDeleted && (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handlePinMessage(item.id)}
              >
                <Icon name="pin-outline" size={16} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteMessage(item.id)}
              >
                <Icon name="trash-outline" size={16} color="#999" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {item.userId === currentUser.id && (
        <View style={styles.messageAvatar}>
          {currentUser.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
  
  const renderParticipantsModal = () => (
    <View style={styles.participantsModal}>
      <View style={styles.participantsHeader}>
        <Text style={styles.participantsTitle}>
          Participants ({participantsList.length})
        </Text>
        <TouchableOpacity onPress={() => setShowParticipants(false)}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={participantsList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.participantItem}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {item.isAdmin ? '👑' : item.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>
                {item.name}
                {item.isAdmin && <Text style={styles.participantAdminBadge}> (Admin)</Text>}
              </Text>
              <View style={styles.participantStatus}>
                <View style={[styles.statusDot, item.isOnline && styles.statusOnline]} />
                <Text style={styles.statusText}>
                  {item.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            {currentUser.isAdmin && !item.isAdmin && (
              <TouchableOpacity onPress={() => handleMuteUser(item.id)}>
                <Icon name="mic-off-outline" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerInfo}
          onPress={() => setShowParticipants(true)}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>👑</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{name || 'Admin Talk'}</Text>
            <Text style={styles.headerSubtitle}>
              {participants} participants • Admin online
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {currentUser.isAdmin && (
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => setShowAdminTools(!showAdminTools)}
            >
              <Icon name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerAction}>
            <Icon name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Admin Tools */}
      {showAdminTools && currentUser.isAdmin && (
        <View style={styles.adminTools}>
          <TouchableOpacity style={styles.adminToolItem} onPress={handleAnnouncement}>
            <Icon name="megaphone-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Announcement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminToolItem}>
            <Icon name="people-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminToolItem}>
            <Icon name="stats-chart-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        </View>
      )}
      
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="attach-outline" size={24} color="#075E54" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            setIsTyping(text.length > 0);
          }}
          multiline
        />
        
        {message.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="send" size={22} color="#075E54" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic-outline" size={24} color="#075E54" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Participants Modal */}
      {showParticipants && renderParticipantsModal()}
    </KeyboardAvoidingView>
  );
};


export default AdminTalkScreen;