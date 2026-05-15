
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginLeft: 16,
  },
  adminTools: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  adminToolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  adminToolText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#075E54',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  adminMessageContainer: {
    // Special styling for admin messages
  },
  deletedMessageContainer: {
    opacity: 0.7,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    marginRight: 8,
    marginLeft: 8,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatar: {
    backgroundColor: '#FFF3E0',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
  },
  messageBubble: {
    flex: 1,
    maxWidth: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: '#DCF8C6',
  },
  adminMessageBubble: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUserName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#075E54',
  },
  adminUserName: {
    color: '#FF9800',
  },
  adminBadge: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#FF9800',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 20,
  },
  deletedMessageText: {
    fontStyle: 'italic',
    color: '#999',
  },
  repliesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  replyItem: {
    flexDirection: 'row',
    marginTop: 4,
  },
  replyUserName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#075E54',
    marginRight: 6,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  messageActions: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  actionCount: {
    fontSize: 11,
    color: '#999',
    marginLeft: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
  participantsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantAvatarText: {
    fontSize: 20,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  participantAdminBadge: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#FF9800',
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#999',
  },
});

export default styles 