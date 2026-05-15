import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  // StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  Switch,
  // FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CryptoJS from 'crypto-js';
import useChatStore from '../../store/chatStore';
import { useRouter } from 'expo-router'
import BottomNavigationBar from '../../components/BottomNavigationBar'
import styles from './ProfileStyle';
const { width: SCREEN_WIDTH } = Dimensions.get('window');


const ProfilePage = () => {
    const navigation = useRouter()
  const { user, updateUser, contacts, chats } = useChatStore() as {
     user: any, updateUser: void, contacts: number, chats: string 
  };
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Himanshu',
    username: '@at.ul8809',
    bio: 'Living life one day at a time ✨',
    website: 'https://himanshu.com',
    email: 'atul4545@zohomail.in',
    phone: '+1234567890',
    avatar: user?.avatar || null,
    posts: 42,
    followers: 1234,
    following: 567,
  });

  // Connection State
  const [connections, setConnections] = useState([
    { id: '2', name: 'Alice Johnson', username: '@alicej', avatar: null, status: 'connected', chatEnabled: true },
    { id: '3', name: 'Bob Smith', username: '@bobsmith', avatar: null, status: 'pending', chatEnabled: false },
    { id: '4', name: 'Carol Williams', username: '@carolw', avatar: null, status: 'connected', chatEnabled: true },
    { id: '5', name: 'David Brown', username: '@davidb', avatar: null, status: 'not_connected', chatEnabled: false },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: '6', name: 'Eva Martinez', username: '@evam', avatar: null, requestedAt: '2h ago' },
    { id: '7', name: 'Frank Wilson', username: '@frankw', avatar: null, requestedAt: '5h ago' },
  ]);

  // Encryption State
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyType, setKeyType] = useState(''); // 'encrypt' or 'decrypt'
  const [savedDecryptionKey, setSavedDecryptionKey] = useState<string>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'connections', 'settings'
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profileData });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved encryption keys
  useEffect(() => {
    loadEncryptionKeys();
  }, []);

  const loadEncryptionKeys = async () => {
    try {
      const encryptKey = await AsyncStorage.getItem('encryptionKey');
      const decryptKey = await AsyncStorage.getItem('decryptionKey');
      if (encryptKey) {
        setSavedEncryptionKey(encryptKey);
        setEncryptionEnabled(true);
      }
      if (decryptKey) {
        setSavedDecryptionKey(decryptKey);
      }
    } catch (error) {
      console.error('Error loading encryption keys:', error);
    }
  };

  // Encryption Functions
  const encryptMessage = (message, key) => {
    try {
      // const encrypted = CryptoJS.AES.encrypt(message, key).toString();
      // return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };

  const decryptMessage = (encryptedMessage, key) => {
    try {
      // const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
      // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  };

  const handleSaveEncryptionKeys = async () => {
    if (!encryptionKey.trim() || !decryptionKey.trim()) {
      Alert.alert('Error', 'Please enter both encryption and decryption keys');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('encryptionKey', encryptionKey);
      await AsyncStorage.setItem('decryptionKey', decryptionKey);
      
      setSavedEncryptionKey(encryptionKey);
      setSavedDecryptionKey(decryptionKey);
      setEncryptionEnabled(true);
      setShowKeyModal(false);
      setEncryptionKey('');
      setDecryptionKey('');

      Alert.alert('Success', 'Encryption keys saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save encryption keys');
    } finally {
      setIsLoading(false);
    }
  };

  const testEncryption = () => {
    if (!savedEncryptionKey || !savedDecryptionKey) {
      Alert.alert('Error', 'Please set encryption keys first');
      return;
    }

    const testMessage = 'Hello, this is a test message!';
    const encrypted = encryptMessage(testMessage, savedEncryptionKey);
    const decrypted = decryptMessage(encrypted, savedDecryptionKey);

    if (decrypted === testMessage) {
      Alert.alert(
        'Encryption Test',
        `Original: ${testMessage}\nEncrypted: ${encrypted.substring(0, 50)}...\nDecrypted: ${decrypted}\n\nStatus: ✅ Working`
      );
    } else {
      Alert.alert('Error', 'Encryption test failed. Keys may not match.');
    }
  };

  // Connection Functions
  const handleConnectRequest = (userId) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === userId
          ? { ...conn, status: 'pending', chatEnabled: false }
          : conn
      )
    );
    Alert.alert('Request Sent', 'Connection request has been sent');
  };

  const handleAcceptRequest = (userId) => {
    // Move from pending to connections
    const user = pendingRequests.find(req => req.id === userId);
    if (user) {
      setConnections(prev => [
        ...prev,
        { ...user, status: 'connected', chatEnabled: true }
      ]);
      setPendingRequests(prev => prev.filter(req => req.id !== userId));
      Alert.alert('Accepted', `${user.name} is now connected`);
    }
  };

  const handleRejectRequest = (userId) => {
    setPendingRequests(prev => prev.filter(req => req.id !== userId));
  };

  const handleDisconnect = (userId) => {
    const user = connections.find(conn => conn.id === userId);
    if (user) {
      Alert.alert(
        'Disconnect',
        `Are you sure you want to disconnect from ${user.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: () => {
              setConnections(prev => prev.filter(conn => conn.id !== userId));
            },
          },
        ]
      );
    }
  };

  const handleStartChat = (user) => {
    if (user.chatEnabled && user.status === 'connected') {
      // Navigate to chat screen
      navigation.navigate('Chat', {
        chatId: user.id,
        chatName: user.name,
        encrypted: encryptionEnabled,
      });
    } else {
      Alert.alert(
        'Cannot Chat',
        'You can only chat with connected friends. Please connect first.',
        [
          {
            text: 'Connect',
            onPress: () => handleConnectRequest(user.id),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  // Profile Functions
  const handleSaveProfile = () => {
    if (!editedProfile.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setProfileData(editedProfile);
    updateUser(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please confirm you want to delete your account.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    setIsLoading(true);
                    try {
                      await AsyncStorage.clear();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    } catch (error) {
                      console.error('Delete error:', error);
                      setIsLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Render Functions
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        {profileData.avatar ? (
          <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {profileData.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.profileInfo}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.editInput}
              value={editedProfile.name}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, name: text })
              }
              placeholder="Name"
            />
            <TextInput
              style={styles.editInput}
              value={editedProfile.username}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, username: text })
              }
              placeholder="Username"
            />
            <TextInput
              style={[styles.editInput, styles.editBio]}
              value={editedProfile.bio}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, bio: text })
              }
              placeholder="Bio"
              multiline
            />
          </>
        ) : (
          <>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileUsername}>{profileData.username}</Text>
            <Text style={styles.profileBio}>{profileData.bio}</Text>
            {profileData.website && (
              <Text style={styles.profileWebsite}>{profileData.website}</Text>
            )}
          </>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => {
              setEditedProfile({ ...profileData });
              setIsEditing(true);
            }}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
        onPress={() => setActiveTab('posts')}
      >
        <Icon
          name="grid-outline"
          size={24}
          color={activeTab === 'posts' ? '#000' : '#999'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
        onPress={() => setActiveTab('connections')}
      >
        <Icon
          name="people-outline"
          size={24}
          color={activeTab === 'connections' ? '#000' : '#999'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
        onPress={() => setActiveTab('settings')}
      >
        <Icon
          name="settings-outline"
          size={24}
          color={activeTab === 'settings' ? '#000' : '#999'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderConnections = () => (
    <View style={styles.contentContainer}>
      {/* Connected Friends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Connected Friends ({connections.filter(c => c.status === 'connected').length})
        </Text>
        {connections
          .filter(conn => conn.status === 'connected')
          .map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userUsername}>{user.username}</Text>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => handleStartChat(user)}
                >
                  <Icon name="chatbubble-outline" size={20} color="#fff" />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={() => handleDisconnect(user.id)}
                >
                  <Icon name="close-circle-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>

      {/* Pending Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pending Requests ({connections.filter(c => c.status === 'pending').length})
        </Text>
        {connections
          .filter(conn => conn.status === 'pending')
          .map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.pendingText}>Pending...</Text>
                </View>
              </View>
            </View>
          ))}
      </View>

      {/* Received Requests */}
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Received Requests ({pendingRequests.length})
          </Text>
          {pendingRequests.map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userUsername}>{user.username}</Text>
                  <Text style={styles.requestTime}>{user.requestedAt}</Text>
                </View>
              </View>
              <View style={styles.requestActions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(user.id)}
                >
                  <Icon name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleRejectRequest(user.id)}
                >
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Suggest Connections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        {connections
          .filter(conn => conn.status === 'not_connected')
          .map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userUsername}>{user.username}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnectRequest(user.id)}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.contentContainer}>
      {/* Encryption Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>🔐 Message Encryption</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>End-to-End Encryption</Text>
            <Text style={styles.settingDescription}>
              {encryptionEnabled
                ? 'Your messages are encrypted'
                : 'Enable to secure your messages'}
            </Text>
          </View>
          <Switch
            value={encryptionEnabled}
            onValueChange={(value) => {
              if (!value) {
                Alert.alert(
                  'Disable Encryption',
                  'Are you sure? Your messages will no longer be encrypted.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Disable',
                      onPress: async () => {
                        await AsyncStorage.removeItem('encryptionKey');
                        await AsyncStorage.removeItem('decryptionKey');
                        setSavedEncryptionKey(null);
                        setSavedDecryptionKey(null);
                        setEncryptionEnabled(false);
                      },
                    },
                  ]
                );
              } else {
                setKeyType('set');
                setShowKeyModal(true);
              }
            }}
            trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
            thumbColor={encryptionEnabled ? '#075E54' : '#f4f3f4'}
          />
        </View>

        {encryptionEnabled && (
          <>
            <TouchableOpacity
              style={styles.keyActionButton}
              onPress={() => {
                setKeyType('update');
                setShowKeyModal(true);
              }}
            >
              <Icon name="key-outline" size={20} color="#075E54" />
              <Text style={styles.keyActionText}>Update Encryption Keys</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keyActionButton}
              onPress={testEncryption}
            >
              <Icon name="checkmark-circle-outline" size={20} color="#075E54" />
              <Text style={styles.keyActionText}>Test Encryption</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Account Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>⚙️ Account Settings</Text>
        
        <TouchableOpacity style={styles.settingRow}>
          <Icon name="person-outline" size={22} color="#000" />
          <Text style={styles.settingRowText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Icon name="notifications-outline" size={22} color="#000" />
          <Text style={styles.settingRowText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Icon name="lock-closed-outline" size={22} color="#000" />
          <Text style={styles.settingRowText}>Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Icon name="help-circle-outline" size={22} color="#000" />
          <Text style={styles.settingRowText}>Help Center</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <Text style={styles.dangerSectionTitle}>⚠️ Danger Zone</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={22} color="#FF5252" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPostsGrid = () => (
    <View style={styles.postsGrid}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View key={index} style={styles.postItem}>
          <View style={styles.postPlaceholder}>
            <Icon name="image-outline" size={30} color="#ccc" />
          </View>
        </View>
      ))}
      {profileData.posts === 0 && (
        <View style={styles.noPosts}>
          <Icon name="camera-outline" size={50} color="#ccc" />
          <Text style={styles.noPostsText}>No posts yet</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.back()}
          style={styles.headerButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {profileData.username}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.push('login')}
          style={styles.headerButton}
        >
          login
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.headerButton}>
          <Icon name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderTabs()}
        
        {activeTab === 'posts' && renderPostsGrid()}
        {activeTab === 'connections' && renderConnections()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>

      {/* Encryption Key Modal */}
      <Modal
        visible={showKeyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.keyModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {keyType === 'update' ? 'Update Encryption Keys' : 'Set Encryption Keys'}
              </Text>
              <TouchableOpacity onPress={() => setShowKeyModal(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter your encryption and decryption keys to secure your messages.
              These keys must match for the encryption to work.
            </Text>

            <View style={styles.keyInputContainer}>
              <Text style={styles.keyLabel}>Encryption Key</Text>
              <View style={styles.keyInputWrapper}>
                <Icon name="lock-closed-outline" size={20} color="#075E54" />
                <TextInput
                  style={styles.keyInput}
                  placeholder="Enter encryption key"
                  placeholderTextColor="#999"
                  value={encryptionKey}
                  onChangeText={setEncryptionKey}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.keyInputContainer}>
              <Text style={styles.keyLabel}>Decryption Key</Text>
              <View style={styles.keyInputWrapper}>
                <Icon name="lock-open-outline" size={20} color="#075E54" />
                <TextInput
                  style={styles.keyInput}
                  placeholder="Enter decryption key"
                  placeholderTextColor="#999"
                  value={decryptionKey}
                  onChangeText={setDecryptionKey}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.keyInfo}>
              <Icon name="information-circle-outline" size={16} color="#1976D2" />
              <Text style={styles.keyInfoText}>
                Keys are stored locally and never shared. 
                Make sure to remember them!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveKeyButton,
                (!encryptionKey.trim() || !decryptionKey.trim()) && styles.saveKeyButtonDisabled,
              ]}
              onPress={handleSaveEncryptionKeys}
              disabled={!encryptionKey.trim() || !decryptionKey.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="save-outline" size={20} color="#fff" />
                  <Text style={styles.saveKeyButtonText}>Save Keys</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavigationBar/>
    </View>
  );
};


export default ProfilePage;