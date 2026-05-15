import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import useChatStore from '../../store/chatStore';
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from './GroupInfoStyle';

const GroupInfo = () => {
  const navigation = useRouter()
  const { chatId } = useLocalSearchParams();

  const { chats, contacts } = useChatStore()as {
    chats: string,
    contacts: any
  };
  
  // Find the group chat from store
  const groupChat = chats.find((chat) => chat.id === chatId);
  
  // Dummy group data (in real app, fetch from API)
  const [groupData, setGroupData] = useState({
    id: chatId,
    name: groupChat?.name || 'Team Project',
    description: 'Project coordination and updates',
    image: null,
    createdBy: '1', // User ID
    createdAt: '2024-01-10',
    memberCount: 8,
    type: 'group',
    settings: {
      allowMembersToSendMessages: true,
      allowMembersToAddOthers: false,
      allowMembersToEditGroupInfo: false,
      muteNotifications: false,
    },
  });

  // Dummy members list
  const [members, setMembers] = useState([
    { id: '1', name: 'John Doe', phone: '+1234567890', role: 'admin', avatar: null },
    { id: '2', name: 'Alice Johnson', phone: '+1234567891', role: 'member', avatar: null },
    { id: '3', name: 'Bob Smith', phone: '+1234567892', role: 'member', avatar: null },
    { id: '5', name: 'David Brown', phone: '+1234567894', role: 'moderator', avatar: null },
    { id: '6', name: 'Eva Martinez', phone: '+1234567895', role: 'member', avatar: null },
    { id: '7', name: 'Frank Wilson', phone: '+1234567896', role: 'member', avatar: null },
    { id: '8', name: 'Grace Lee', phone: '+1234567897', role: 'member', avatar: null },
    { id: '9', name: 'Henry Taylor', phone: '+1234567898', role: 'member', avatar: null },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(groupData.name);
  const [editedDescription, setEditedDescription] = useState(groupData.description);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  const currentUserRole = members.find(m => m.id === '1')?.role || 'member';
  const isAdmin = currentUserRole === 'admin';

  const handleEditImage = () => {
    if (!isAdmin) {
      Alert.alert('Permission Denied', 'Only admins can change the group photo');
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setGroupData({ ...groupData, image: response.assets[0].uri });
        }
      }
    );
  };

  const handleSaveEdit = () => {
    setGroupData({
      ...groupData,
      name: editedName,
      description: editedDescription,
    });
    setIsEditing(false);
    Alert.alert('Success', 'Group information updated successfully');
  };

  const handleToggleSetting = (setting) => {
    if (!isAdmin) {
      Alert.alert('Permission Denied', 'Only admins can change group settings');
      return;
    }
    setGroupData({
      ...groupData,
      settings: {
        ...groupData.settings,
        [setting]: !groupData.settings[setting],
      },
    });
  };

  const handleRemoveMember = (memberId) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMembers(members.filter((m) => m.id !== memberId));
            setGroupData({
              ...groupData,
              memberCount: groupData.memberCount - 1,
            });
          },
        },
      ]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            // In real app, call API to leave group
            navigation.back();
          },
        },
      ]
    );
  };

  const handleReportGroup = () => {
    Alert.alert(
      'Report Group',
      'Please select a reason for reporting this group',
      [
        { text: 'Spam', onPress: () => Alert.alert('Reported', 'Group reported as spam') },
        { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Group reported for inappropriate content') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchMemberQuery.toLowerCase())
  );

  const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 5);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: '#075E54', bgColor: '#E8F5E9' };
      case 'moderator':
        return { label: 'Moderator', color: '#1976D2', bgColor: '#E3F2FD' };
      default:
        return null;
    }
  };

  const renderMemberItem = ({ item }) => {
    const roleBadge = getRoleBadge(item.role);
    const isCurrentUser = item.id === '1';

    return (
      <View style={styles.memberItem}>
        <View style={styles.memberLeft}>
          <View style={styles.memberAvatar}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.memberInfo}>
            <View style={styles.memberNameRow}>
              <Text style={styles.memberName}>
                {item.name} {isCurrentUser && '(You)'}
              </Text>
              {roleBadge && (
                <View style={[styles.roleBadge, { backgroundColor: roleBadge.bgColor }]}>
                  <Text style={[styles.roleText, { color: roleBadge.color }]}>
                    {roleBadge.label}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.memberPhone}>{item.phone}</Text>
          </View>
        </View>
        {isAdmin && !isCurrentUser && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMember(item.id)}
          >
            <Icon name="ellipsis-vertical" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    );
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
        <Text style={styles.headerTitle}>Group Info</Text>
        {isAdmin && !isEditing && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setEditedName(groupData.name);
              setEditedDescription(groupData.description);
              setIsEditing(true);
            }}
          >
            <Icon name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {isEditing && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSaveEdit}
          >
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Image & Name Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleEditImage} disabled={!isAdmin}>
            <View style={styles.groupImageContainer}>
              {groupData.image ? (
                <Image source={{ uri: groupData.image }} style={styles.groupImage} />
              ) : (
                <View style={styles.groupImagePlaceholder}>
                  <Icon name="people" size={50} color="#075E54" />
                </View>
              )}
              {isAdmin && (
                <View style={styles.editImageBadge}>
                  <Icon name="camera" size={14} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editFields}>
              <TextInput
                style={styles.editInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Group name"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Group description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>
          ) : (
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{groupData.name}</Text>
              <Text style={styles.groupDescription}>{groupData.description}</Text>
              <Text style={styles.groupMeta}>
                Group · {groupData.memberCount} members
              </Text>
            </View>
          )}
        </View>

        {/* Group Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="notifications-off-outline" size={22} color="#075E54" />
            </View>
            <Text style={styles.actionText}>Mute Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="star-outline" size={22} color="#1976D2" />
            </View>
            <Text style={styles.actionText}>Starred Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="search-outline" size={22} color="#F57C00" />
            </View>
            <Text style={styles.actionText}>Search Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Group Settings (Admin only) */}
        {isAdmin && (
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Group Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>Allow members to send messages</Text>
                <Text style={styles.settingDescription}>
                  Members can send messages in this group
                </Text>
              </View>
              <Switch
                value={groupData.settings.allowMembersToSendMessages}
                onValueChange={() => handleToggleSetting('allowMembersToSendMessages')}
                trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
                thumbColor={
                  groupData.settings.allowMembersToSendMessages ? '#075E54' : '#f4f3f4'
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>Allow members to add others</Text>
                <Text style={styles.settingDescription}>
                  Members can add new participants
                </Text>
              </View>
              <Switch
                value={groupData.settings.allowMembersToAddOthers}
                onValueChange={() => handleToggleSetting('allowMembersToAddOthers')}
                trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
                thumbColor={
                  groupData.settings.allowMembersToAddOthers ? '#075E54' : '#f4f3f4'
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>Allow members to edit group info</Text>
                <Text style={styles.settingDescription}>
                  Members can change group name, photo, and description
                </Text>
              </View>
              <Switch
                value={groupData.settings.allowMembersToEditGroupInfo}
                onValueChange={() => handleToggleSetting('allowMembersToEditGroupInfo')}
                trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
                thumbColor={
                  groupData.settings.allowMembersToEditGroupInfo ? '#075E54' : '#f4f3f4'
                }
              />
            </View>
          </View>
        )}

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.sectionTitle}>
              Members ({groupData.memberCount})
            </Text>
            {isAdmin && (
              <TouchableOpacity style={styles.addMemberButton}>
                <Icon name="person-add-outline" size={20} color="#075E54" />
                <Text style={styles.addMemberText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search Members */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search-outline" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search members..."
                value={searchMemberQuery}
                onChangeText={setSearchMemberQuery}
                placeholderTextColor="#999"
              />
              {searchMemberQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchMemberQuery('')}>
                  <Icon name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Members List */}
          {displayedMembers.map((member) => (
            <View key={member.id}>{renderMemberItem({ item: member })}</View>
          ))}

          {filteredMembers.length > 5 && (
            <TouchableOpacity
              style={styles.showAllButton}
              onPress={() => setShowAllMembers(!showAllMembers)}
            >
              <Text style={styles.showAllText}>
                {showAllMembers
                  ? 'Show Less'
                  : `Show All ${filteredMembers.length} Members`}
              </Text>
              <Icon
                name={showAllMembers ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#075E54"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity
            style={styles.dangerItem}
            onPress={handleReportGroup}
          >
            <Icon name="flag-outline" size={22} color="#F44336" />
            <Text style={styles.dangerText}>Report Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerItem}
            onPress={handleLeaveGroup}
          >
            <Icon name="exit-outline" size={22} color="#F44336" />
            <Text style={styles.dangerText}>Leave Group</Text>
          </TouchableOpacity>
        </View>

        {/* Group Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Created on {groupData.createdAt}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default GroupInfo;