// // import EmptyUI from "../comp/EmptyUI";
// // import MessageBubble from "../comp/MessageBubble";
// // import { useCurrentUser } from "../hooks/useAuth";
// // import { useMessages } from "../hooks/useMessages";
// // import { useSocketStore } from "../lib/socket";
// import { MessageSender } from "../types";
import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { create } from "zustand";

// type ChatParams = {
//   id: string;
//   participantId: string;
//   name: string;
//   avatar: string;
// };
// const useCurrentUser = create((set,get) => ({data:[]}))
// const useMessages = create((set,get) => ({data:[]}))
// const useSocketStore = create((set,get) => ({joinChat:null, leaveChat: null, sendMessage: null, sendTyping: null, isConnected:null, onlineUsers: null, typingUsers: null }))

// const ChatDetailScreen = () => {
//   const { id: chatId, avatar, name, participantId, chatName } = useLocalSearchParams<ChatParams>();
// console.log(id, chatName)
//   const [messageText, setMessageText] = useState("");

//   const [isSending, setIsSending] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   const { data: currentUser } = useCurrentUser() as { data: any};
//   const { data: messages, isLoading } = useMessages(chatId) as { data: any, isLoading: any};

//   const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers } =
//     useSocketStore() as {joinChat: any, leaveChat: any, sendMessage: any, sendTyping: any, isConnected: any, onlineUsers: any, typingUsers: any };

//   const isOnline = participantId ? onlineUsers.has(participantId) : false;
//   const isTyping = typingUsers.get(chatId) === participantId;

//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // join chat room on mount, leave on unmount
//   useEffect(() => {
//     if (chatId && isConnected) joinChat(chatId);

//     return () => {
//       if (chatId) leaveChat(chatId);
//     };
//   }, [chatId, isConnected, joinChat, leaveChat]);

//   // scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messages && messages.length > 0) {
//       setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [messages]);

//   const handleTyping = useCallback(
//     (text: string) => {
//       setMessageText(text);

//       if (!isConnected || !chatId) return;

//       // send typing start
//       if (text.length > 0) {
//         sendTyping(chatId, true);

//         // clear existing timeout
//         if (typingTimeoutRef.current) {
//           clearTimeout(typingTimeoutRef.current);
//         }

//         // stop typing after 2 seconds of no input
//         typingTimeoutRef.current = setTimeout(() => {
//           sendTyping(chatId, false);
//         }, 2000);
//       } else {
//         // text cleared, stop typing
//         if (typingTimeoutRef.current) {
//           clearTimeout(typingTimeoutRef.current);
//         }
//         sendTyping(chatId, false);
//       }
//     },
//     [chatId, isConnected, sendTyping]
//   );

//   const handleSend = () => {
//     console.log({ isSending, isConnected, currentUser, messageText });
//     if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

//     // stop typing indicator
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
//     sendTyping(chatId, false);

//     setIsSending(true);
//     sendMessage(chatId, messageText.trim(), {
//       _id: currentUser._id,
//       name: currentUser.name,
//       email: currentUser.email,
//       avatar: currentUser.avatar,
//     });
//     setMessageText("");
//     setIsSending(false);

//     setTimeout(() => {
//       scrollViewRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#F4A261" />
//         </Pressable>
//         <View style={styles.headerInfo}>
//           {avatar && <Image source={avatar} style={styles.avatar} />}
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerName} numberOfLines={1}>
//               {name}
//             </Text>
//             <Text style={[styles.headerStatus, isTyping && styles.headerStatusTyping]}>
//               {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.headerActions}>
//           <Pressable style={styles.headerActionButton}>
//             <Ionicons name="call-outline" size={20} color="#A0A0A5" />
//           </Pressable>
//           <Pressable style={styles.headerActionButton}>
//             <Ionicons name="videocam-outline" size={20} color="#A0A0A5" />
//           </Pressable>
//         </View>
//       </View>

//       {/* Message + Keyboard input */}
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={0}
//       >
//         <View style={styles.messagesContainer}>
//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#F4A261" />
//             </View>
//           ) : !messages || messages.length === 0 ? (
//             // <EmptyUI
//             //   title="No messages yet"
//             //   subtitle="Start the conversation!"
//             //   iconName="chatbubbles-outline"
//             //   iconColor="#6B6B70"
//             //   iconSize={64}
//             // />
//             <>
//             </>
//           ) : (
//             <ScrollView
//               ref={scrollViewRef}
//               contentContainerStyle={styles.messagesList}
//               onContentSizeChange={() => {
//                 scrollViewRef.current?.scrollToEnd({ animated: false });
//               }}
//             >
//               {messages.map((message) => {
//                 const senderId = (message.sender as MessageSender)._id;
//                 const isFromMe = currentUser ? senderId === currentUser._id : false;
//                 return <>...</>
//                 // return <MessageBubble key={message._id} message={message} isFromMe={isFromMe} />;
//               })}
//             </ScrollView>
//           )}

//           {/* Input bar */}
//           <View style={styles.inputBar}>
//             <View style={styles.inputContainer}>
//               <Pressable style={styles.addButton}>
//                 <Ionicons name="add" size={22} color="#F4A261" />
//               </Pressable>

//               <TextInput
//                 placeholder="Type a message"
//                 placeholderTextColor="#6B6B70"
//                 style={styles.textInput}
//                 multiline
//                 maxHeight={100}
//                 value={messageText}
//                 onChangeText={handleTyping}
//                 onSubmitEditing={handleSend}
//                 editable={!isSending}
//               />

//               <Pressable
//                 style={[
//                   styles.sendButton,
//                   (!messageText.trim() || isSending) && styles.sendButtonDisabled
//                 ]}
//                 onPress={handleSend}
//                 disabled={!messageText.trim() || isSending}
//               >
//                 {isSending ? (
//                   <ActivityIndicator size="small" color="#0D0D0F" />
//                 ) : (
//                   <Ionicons name="send" size={18} color="#0D0D0F" />
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // bg-surface
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1C1C1E', // bg-surface
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // border-surface-light
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerName: {
    color: '#FFFFFF', // text-foreground
    fontWeight: '600',
    fontSize: 16,
  },
  headerStatus: {
    fontSize: 12,
    color: '#8E8E93', // text-muted-foreground
  },
  headerStatusTyping: {
    color: '#F4A261', // text-primary
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Keyboard Avoiding View
  keyboardAvoidingView: {
    flex: 1,
  },

  // Messages Container
  messagesContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E', // bg-surface
    // height: '10%'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    // height: '10%'
  },

  // Input Bar Styles
  inputBar: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#1C1C1E', // bg-surface
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E', // border-surface-light
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2C2C2E', // bg-surface-card
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF', // text-foreground
    fontSize: 14,
    marginBottom: 8,
    padding: 0,
    maxHeight: 100,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4A261', // bg-primary
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});


// import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatDetailScreen = () => {
  
  const { id: chatId,chat, avatar, name, participantId, chatName, messages,isOnline, lastMessage, time, unread } = useLocalSearchParams<ChatParams>();
  // console.log( chatId, chat, avatar, name, participantId, chatName, messages,isOnline, lastMessage, time, unread )
  // console.log(useLocalSearchParams)
  // console.log(chat)
  const isLoading = false
    const [messageText, setMessageText] = React.useState("");
const handleTyping = useCallback(
  () => {
    first
  },
  [second],
)
const [isSending, setIsSending] = useState(false);
const handleSend = () => {}
const router = useRouter()
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>    {/* Header */}
       <View style={styles.header}>
         <Pressable onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#F4A261" />
         </Pressable>
         <View style={styles.headerInfo}>
           {avatar && <Image source={avatar} style={styles.avatar} />}
           <View style={styles.headerTextContainer}>
             <Text style={styles.headerName} numberOfLines={1}>
               {name}
             </Text>
             {/* <Text style={[styles.headerStatus, isTyping && styles.headerStatusTyping]}>
               {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
             </Text> */}
           </View>
         </View>
                  <View style={styles.headerActions}>
           <Pressable style={styles.headerActionButton}>
             <Ionicons name="call-outline" size={20} color="#A0A0A5" />
           </Pressable>
           <Pressable style={styles.headerActionButton}>
             <Ionicons name="videocam-outline" size={20} color="#A0A0A5" />
           </Pressable>
         </View>
       </View>

         {/* </View> */}

         {/* <ScrollView>       Message + Keyboard input
         </ScrollView>       Message + Keyboard input */}
         hello
       <KeyboardAvoidingView
         style={styles.keyboardAvoidingView}
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         keyboardVerticalOffset={0}
       >
         <View style={styles.messagesContainer}>
           {isLoading ? (
             <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#F4A261" />
             </View>
           ) : !messages || messages.length === 0 ? (
             // <EmptyUI
             //   title="No messages yet"
             //   subtitle="Start the conversation!"
             //   iconName="chatbubbles-outline"
             //   iconColor="#6B6B70"
             //   iconSize={64}
             // />
             <>
             </>
           ) : (
             <ScrollView
               ref={scrollViewRef}
               contentContainerStyle={styles.messagesList}
               onContentSizeChange={() => {
                 scrollViewRef.current?.scrollToEnd({ animated: false });
               }}
             >
               {messages.map((message) => {
                 const senderId = (message.sender as MessageSender)._id;
                 const isFromMe = currentUser ? senderId === currentUser._id : false;
                 return <>...</>
                 // return <MessageBubble key={message._id} message={message} isFromMe={isFromMe} />;
               })}
             </ScrollView>
           )}

           {/* Input bar */}
           <View style={styles.inputBar}>
             <View style={styles.inputContainer}>
               <Pressable style={styles.addButton}>
                 <Ionicons name="add" size={22} color="#F4A261" />
               </Pressable>

               <TextInput
                 placeholder="Type a message"
                 placeholderTextColor="#6B6B70"
                 style={styles.textInput}
                 multiline
                 maxHeight={100}
                 value={messageText}
                 onChangeText={handleTyping}
                 onSubmitEditing={handleSend}
                 editable={!isSending}
               />

               <Pressable
                 style={[
                   styles.sendButton,
                   (!messageText.trim() || isSending) && styles.sendButtonDisabled
                 ]}
                 onPress={handleSend}
                 disabled={!messageText.trim() || isSending}
               >
                 {isSending ? (
                   <ActivityIndicator size="small" color="#0D0D0F" />
                 ) : (
                   <Ionicons name="send" size={18} color="#0D0D0F" />
                 )}
               </Pressable>
             </View>
           </View>
         </View>
       </KeyboardAvoidingView>
    {/* <View>
      <Text>{chatName}</Text>
    </View> */}
    </SafeAreaView>
  )
}

export default ChatDetailScreen;

// const styles = StyleSheet.create({})