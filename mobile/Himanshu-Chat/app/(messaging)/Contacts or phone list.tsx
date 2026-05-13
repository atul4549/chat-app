import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Contacts = () => {
  return (
    <View>
      <Text>Contacts</Text>
    </View>
  )
}

export default Contacts

const styles = StyleSheet.create({})
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import useChatStore from '../../store/chatStore';
// import { useRouter } from "expo-router";
// // import { create } from 'zustand';

// // export const useChatStore = create((set) => ({
// //   // User
// //   user: {
// //     id: '1',
// //     name: 'John Doe',
// //     phone: '+1234567890',
// //     avatar: null,
// //     status: 'Hey there! I am using ChatApp',
// //   },
  
// //   // Chats list
// //   chats: [
// //     {
// //       id: '1',
// //       name: 'Alice Johnson',
// //       lastMessage: 'See you tomorrow!',
// //       time: '10:30 AM',
// //       unread: 2,
// //       avatar: null,
// //       isOnline: true,
// //     },
// //     {
// //       id: '2',
// //       name: 'Bob Smith',
// //       lastMessage: 'Thanks for the update',
// //       time: 'Yesterday',
// //       unread: 0,
// //       avatar: null,
// //       isOnline: false,
// //     },
// //     {
// //       id: '3',
// //       name: 'Carol Williams',
// //       lastMessage: 'Can you send the file?',
// //       time: 'Monday',
// //       unread: 1,
// //       avatar: null,
// //       isOnline: true,
// //     },
// //     {
// //       id: '4',
// //       name: 'Team Project',
// //       lastMessage: 'David: Meeting at 3 PM',
// //       time: '12:45 PM',
// //       unread: 5,
// //       avatar: null,
// //       isOnline: null,
// //       isGroup: true,
// //     },
// //   ],
  
// //   // Messages (keyed by chatId)
// //   messages: {
// //     '1': [
// //       {
// //         _id: '1',
// //         text: 'Hey! How are you?',
// //         createdAt: new Date('2024-01-15T10:00:00'),
// //         user: { _id: '2', name: 'Alice Johnson' },
// //       },
// //       {
// //         _id: '2',
// //         text: 'I am good, thanks! How about you?',
// //         createdAt: new Date('2024-01-15T10:05:00'),
// //         user: { _id: '1', name: 'John Doe' },
// //       },
// //       {
// //         _id: '3',
// //         text: 'See you tomorrow!',
// //         createdAt: new Date('2024-01-15T10:30:00'),
// //         user: { _id: '2', name: 'Alice Johnson' },
// //       },
// //     ],
// //     '2': [
// //       {
// //         _id: '1',
// //         text: 'Project update: Everything is on track',
// //         createdAt: new Date('2024-01-14T15:00:00'),
// //         user: { _id: '1', name: 'John Doe' },
// //       },
// //       {
// //         _id: '2',
// //         text: 'Thanks for the update',
// //         createdAt: new Date('2024-01-14T15:30:00'),
// //         user: { _id: '3', name: 'Bob Smith' },
// //       },
// //     ],
// //     '3': [
// //       {
// //         _id: '1',
// //         text: 'Can you send the file?',
// //         createdAt: new Date('2024-01-13T09:00:00'),
// //         user: { _id: '4', name: 'Carol Williams' },
// //       },
// //     ],
// //     '4': [
// //       {
// //         _id: '1',
// //         text: 'Welcome to the team group!',
// //         createdAt: new Date('2024-01-15T12:00:00'),
// //         user: { _id: '5', name: 'David' },
// //       },
// //       {
// //         _id: '2',
// //         text: 'Meeting at 3 PM',
// //         createdAt: new Date('2024-01-15T12:45:00'),
// //         user: { _id: '5', name: 'David' },
// //       },
// //     ],
// //   },
  
// //   // Contacts
// //   contacts: [
// //     { id: '2', name: 'Alice Johnson', phone: '+1234567891', avatar: null },
// //     { id: '3', name: 'Bob Smith', phone: '+1234567892', avatar: null },
// //     { id: '4', name: 'Carol Williams', phone: '+1234567893', avatar: null },
// //     { id: '5', name: 'David Brown', phone: '+1234567894', avatar: null },
// //     { id: '6', name: 'Eva Martinez', phone: '+1234567895', avatar: null },
// //     { id: '7', name: 'Frank Wilson', phone: '+1234567896', avatar: null },
// //   ],
  
// //   // Calls
// //   activeCall: null,
// //   callHistory: [],
  
// //   // Add message
// //   addMessage: (chatId, message) =>
// //     set((state) => ({
// //       messages: {
// //         ...state.messages,
// //         [chatId]: [...(state.messages[chatId] || []), message],
// //       },
// //       chats: state.chats.map((chat) =>
// //         chat.id === chatId
// //           ? { ...chat, lastMessage: message.text, time: 'Just now' }
// //           : chat
// //       ),
// //     })),
  
// //   // Set active call
// //   setActiveCall: (call) => set({ activeCall: call }),
  
// //   // Clear active call
// //   clearActiveCall: () => set({ activeCall: null }),
  
// //   // Update user profile
// //   updateUser: (userData) =>
// //     set((state) => ({
// //       user: { ...state.user, ...userData },
// //     })),
// // }));

// // export default useChatStore;

// const ContactsScreen = () => {
//     const navigation = useRouter()
//   const { contacts } = useChatStore();
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredContacts = contacts.filter((contact) =>
//     contact.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderContactItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.contactItem}
//       onPress={() =>
//         navigation.navigate('Chat', {
//           chatId: item.id,
//           chatName: item.name,
//         })
//       }
//       activeOpacity={0.7}
//     >
//       <View style={styles.contactAvatar}>
//         <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//       </View>
//       <View style={styles.contactInfo}>
//         <Text style={styles.contactName}>{item.name}</Text>
//         <Text style={styles.contactPhone}>{item.phone}</Text>
//       </View>
//       <TouchableOpacity style={styles.callButton}>
//         <Icon name="call-outline" size={20} color="#075E54" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.back()}
//           style={styles.backButton}
//         >
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Contacts</Text>
//         <TouchableOpacity style={styles.headerIcon}>
//           <Icon name="add" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Icon name="search-outline" size={20} color="#999" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search contacts..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#999"
//           />
//         </View>
//       </View>

//       {/* Contacts List */}
//       <FlatList
//         data={filteredContacts}
//         renderItem={renderContactItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={() => (
//           <TouchableOpacity
//             style={styles.newGroupButton}
//             onPress={() => navigation.navigate('CreateGroup')}
//           >
//             <View style={styles.newGroupIcon}>
//               <Icon name="people-outline" size={24} color="#075E54" />
//             </View>
//             <Text style={styles.newGroupText}>New Group</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     backgroundColor: '#075E54',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     paddingTop: 50,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   headerIcon: {
//     marginLeft: 15,
//   },
//   searchContainer: {
//     backgroundColor: '#075E54',
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     height: 40,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#000',
//   },
//   listContainer: {
//     paddingHorizontal: 15,
//     paddingTop: 10,
//   },
//   newGroupButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   newGroupIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   newGroupText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   contactAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#075E54',
//   },
//   contactInfo: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 2,
//   },
//   contactPhone: {
//     fontSize: 14,
//     color: '#666',
//   },
//   callButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ContactsScreen;

