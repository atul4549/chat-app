import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useChatStore from '../../store/chatStore';
// import { create } from 'zustand';
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import BottomNavigationBar from '../../components/BottomNavigationBar'
// export const useChatStore = create((set) => ({
//   // User
//   user: {
//     id: '1',
//     name: 'John Doe',
//     phone: '+1234567890',
//     avatar: null,
//     status: 'Hey there! I am using ChatApp',
//   },
  
//   // Chats list
//   chats: [
//     {
//       id: '1',
//       name: 'Alice Johnson',
//       lastMessage: 'See you tomorrow!',
//       time: '10:30 AM',
//       unread: 2,
//       avatar: null,
//       isOnline: true,
//     },
//     {
//       id: '2',
//       name: 'Bob Smith',
//       lastMessage: 'Thanks for the update',
//       time: 'Yesterday',
//       unread: 0,
//       avatar: null,
//       isOnline: false,
//     },
//     {
//       id: '3',
//       name: 'Carol Williams',
//       lastMessage: 'Can you send the file?',
//       time: 'Monday',
//       unread: 1,
//       avatar: null,
//       isOnline: true,
//     },
//     {
//       id: '4',
//       name: 'Team Project',
//       lastMessage: 'David: Meeting at 3 PM',
//       time: '12:45 PM',
//       unread: 5,
//       avatar: null,
//       isOnline: null,
//       isGroup: true,
//     },
//   ],
  
//   // Messages (keyed by chatId)
//   messages: {
//     '1': [
//       {
//         _id: '1',
//         text: 'Hey! How are you?',
//         createdAt: new Date('2024-01-15T10:00:00'),
//         user: { _id: '2', name: 'Alice Johnson' },
//       },
//       {
//         _id: '2',
//         text: 'I am good, thanks! How about you?',
//         createdAt: new Date('2024-01-15T10:05:00'),
//         user: { _id: '1', name: 'John Doe' },
//       },
//       {
//         _id: '3',
//         text: 'See you tomorrow!',
//         createdAt: new Date('2024-01-15T10:30:00'),
//         user: { _id: '2', name: 'Alice Johnson' },
//       },
//     ],
//     '2': [
//       {
//         _id: '1',
//         text: 'Project update: Everything is on track',
//         createdAt: new Date('2024-01-14T15:00:00'),
//         user: { _id: '1', name: 'John Doe' },
//       },
//       {
//         _id: '2',
//         text: 'Thanks for the update',
//         createdAt: new Date('2024-01-14T15:30:00'),
//         user: { _id: '3', name: 'Bob Smith' },
//       },
//     ],
//     '3': [
//       {
//         _id: '1',
//         text: 'Can you send the file?',
//         createdAt: new Date('2024-01-13T09:00:00'),
//         user: { _id: '4', name: 'Carol Williams' },
//       },
//     ],
//     '4': [
//       {
//         _id: '1',
//         text: 'Welcome to the team group!',
//         createdAt: new Date('2024-01-15T12:00:00'),
//         user: { _id: '5', name: 'David' },
//       },
//       {
//         _id: '2',
//         text: 'Meeting at 3 PM',
//         createdAt: new Date('2024-01-15T12:45:00'),
//         user: { _id: '5', name: 'David' },
//       },
//     ],
//   },
  
//   // Contacts
//   contacts: [
//     { id: '2', name: 'Alice Johnson', phone: '+1234567891', avatar: null },
//     { id: '3', name: 'Bob Smith', phone: '+1234567892', avatar: null },
//     { id: '4', name: 'Carol Williams', phone: '+1234567893', avatar: null },
//     { id: '5', name: 'David Brown', phone: '+1234567894', avatar: null },
//     { id: '6', name: 'Eva Martinez', phone: '+1234567895', avatar: null },
//     { id: '7', name: 'Frank Wilson', phone: '+1234567896', avatar: null },
//   ],
  
//   // Calls
//   activeCall: null,
//   callHistory: [],
  
//   // Add message
//   addMessage: (chatId, message) =>
//     set((state) => ({
//       messages: {
//         ...state.messages,
//         [chatId]: [...(state.messages[chatId] || []), message],
//       },
//       chats: state.chats.map((chat) =>
//         chat.id === chatId
//           ? { ...chat, lastMessage: message.text, time: 'Just now' }
//           : chat
//       ),
//     })),
  
//   // Set active call
//   setActiveCall: (call) => set({ activeCall: call }),
  
//   // Clear active call
//   clearActiveCall: () => set({ activeCall: null }),
  
//   // Update user profile
//   updateUser: (userData) =>
//     set((state) => ({
//       user: { ...state.user, ...userData },
//     })),
// }));

// export default useChatStore;

const SettingsScreen = () => {
  const navigation = useRouter()
  const { user } = useChatStore();

  const settingsItems = [
    // {
    //   title: 'Account',
    //   items: [
    //     {
    //       name: 'Privacy',
    //       icon: 'lock-closed-outline',
    //       // onPress: () => navigation.navigate('PrivacySettings'),
    //       onPress: () => navigation.push('PrivacySecurity'),
    //     },
    //     {
    //       name: 'Notifications',
    //       icon: 'notifications-outline',
    //       // onPress: () => navigation.navigate('NotificationSettings'),
    //       onPress: () => navigation.push('NotificationPreferences'),
    //     },
    //     {
    //       name: 'Data and Storage',
    //       icon: 'cloud-outline',
    //       onPress: () => {},
    //     },
    //   ],
    // },
    // {
    //   title: 'Preferences',
    //   items: [
    //     {
    //       name: 'Theme',
    //       icon: 'color-palette-outline',
    //       onPress: () => {},
    //     },
    //     {
    //       name: 'Chat Settings',
    //       icon: 'chatbox-outline',
    //       onPress: () => {},
    //     },
    //     {
    //       name: 'Font Size',
    //       icon: 'text-outline',
    //       onPress: () => {},
    //     },
    //   ],
    // },
    {
      // title: 'About',
      title: 'Support',
      items: [
        // {
        //   name: 'Help',
        //   icon: 'help-circle-outline',
        //   onPress: () => {},
        // },
        // {
        //   name: 'Invite Friends',
        //   icon: 'share-outline',
        //   onPress: () => {},
        // },
        {
          name: 'Support',
          icon: 'help-circle-outline',
          onPress: () => navigation.push('Support'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header name='Settings'/>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection}
        onPress={() => navigation.push("/Profile")}
        >
          <View style={styles.profileAvatar}>
            {/* <Text style={styles.avatarText}>{user.name.charAt(0)}</Text> */}
          </View>
          <View style={styles.profileInfo}>
            {/* <Text style={styles.profileName}>{user.name}</Text> */}
            {/* <Text style={styles.profileStatus}>{user.status}</Text> */}
            <Text style={styles.profileName}>{'Shyam...'}</Text>
            <Text style={styles.profileStatus}>{'ONLINE'}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>

        {/* Settings Sections */}
        {settingsItems.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Icon name={item.icon} size={22} color="#075E54" />
                  </View>
                  <Text style={styles.settingText}>{'Support'}</Text>
                  {/* <Text style={styles.settingText}>{item.name}</Text> */}
                </View>
                <Icon name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <BottomNavigationBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 50,
  },
  backButton: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075E54',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
});

export default SettingsScreen;
