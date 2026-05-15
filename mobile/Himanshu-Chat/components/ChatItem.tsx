import { Chat } from "../types";
import { Text, Image, Pressable, View, StyleSheet } from "react-native";
// import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onPress, isOnline, isTyping, hasUnread }: { 
  chat: Chat; 
  onPress: () => void;
  isOnline: boolean;
  isTyping: boolean;
  hasUnread: boolean;
}) => {
  const participant = chat.participant;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]} 
      onPress={onPress}
    >
      {/* avatar & online indicator */}
      <View style={styles.avatarContainer}>
        <Image 
          source={participant.avatar} 
          style={styles.avatar} 
        />
        {isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      {/* chat info */}
      <View style={styles.chatInfoContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.nameText,
              hasUnread && styles.nameTextUnread
            ]}
          >
            {participant.name}
          </Text>

          <View style={styles.metadataContainer}>
            {hasUnread && <View style={styles.unreadDot} />}
            <Text style={styles.timestamp}>
              {/* {chat.lastMessageAt
                ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })
                : ""} */}
            </Text>
          </View>
        </View>

        <View style={styles.messageRow}>
          {isTyping ? (
            <Text style={styles.typingIndicator}>typing...</Text>
          ) : (
            <Text
              style={[
                styles.messageText,
                hasUnread ? styles.messageTextUnread : styles.messageTextRead
              ]}
              numberOfLines={1}
            >
              {chat.lastMessage?.text || "No messages yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  containerPressed: {
    opacity: 0.7,
  },

  // Avatar Section
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#34C759', // bg-green-500
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1C1C1E', // border-surface
  },

  // Chat Info Container
  chatInfoContainer: {
    flex: 1,
    marginLeft: 16,
  },

  // Header Row (Name + Timestamp)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF', // text-foreground (default)
  },
  nameTextUnread: {
    color: '#F4A261', // text-primary when hasUnread
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#F4A261', // bg-primary
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93', // text-subtle-foreground
  },

  // Message Row
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  typingIndicator: {
    fontSize: 14,
    color: '#F4A261', // text-primary
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  messageTextRead: {
    color: '#8E8E93', // text-subtle-foreground
    fontWeight: 'normal',
  },
  messageTextUnread: {
    color: '#FFFFFF', // text-foreground
    fontWeight: '500',
  },
});

export default ChatItem;