import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from "expo-router";
const GroupPermissions = () => {
  const navigation = useRouter()
  const { groupId, groupName } = useLocalSearchParams() || { 
    groupId: '1', 
    groupName: 'Team Project' 
  };

  const [permissions, setPermissions] = useState({
    // Messaging Permissions
    sendMessages: {
      enabled: true,
      label: 'Send Messages',
      description: 'Allow members to send messages in this group',
      icon: 'chatbubble-outline',
      category: 'messaging',
    },
    sendMedia: {
      enabled: true,
      label: 'Send Media',
      description: 'Allow members to send photos, videos, and documents',
      icon: 'image-outline',
      category: 'messaging',
    },
    sendVoiceMessages: {
      enabled: true,
      label: 'Voice Messages',
      description: 'Allow members to send voice messages',
      icon: 'mic-outline',
      category: 'messaging',
    },
    sendStickers: {
      enabled: true,
      label: 'Stickers & GIFs',
      description: 'Allow members to send stickers and GIFs',
      icon: 'happy-outline',
      category: 'messaging',
    },
    sendPolls: {
      enabled: false,
      label: 'Polls',
      description: 'Allow members to create polls',
      icon: 'stats-chart-outline',
      category: 'messaging',
    },

    // Group Management Permissions
    editGroupInfo: {
      enabled: false,
      label: 'Edit Group Info',
      description: 'Allow members to change group name, photo, and description',
      icon: 'create-outline',
      category: 'management',
    },
    addMembers: {
      enabled: false,
      label: 'Add Members',
      description: 'Allow members to add new participants',
      icon: 'person-add-outline',
      category: 'management',
    },
    removeMembers: {
      enabled: false,
      label: 'Remove Members',
      description: 'Allow members to remove other participants',
      icon: 'person-remove-outline',
      category: 'management',
    },
    promoteMembers: {
      enabled: false,
      label: 'Promote Members',
      description: 'Allow members to promote others to admin/moderator',
      icon: 'arrow-up-circle-outline',
      category: 'management',
    },

    // Privacy Permissions
    viewMembersList: {
      enabled: true,
      label: 'View Member List',
      description: 'Allow members to see full list of participants',
      icon: 'people-outline',
      category: 'privacy',
    },
    viewReadReceipts: {
      enabled: true,
      label: 'Read Receipts',
      description: 'Show when messages are read by members',
      icon: 'checkmark-done-outline',
      category: 'privacy',
    },
    viewOnlineStatus: {
      enabled: true,
      label: 'Online Status',
      description: 'Show when members are online in the group',
      icon: 'radio-outline',
      category: 'privacy',
    },
    forwardMessages: {
      enabled: true,
      label: 'Forward Messages',
      description: 'Allow members to forward messages outside the group',
      icon: 'arrow-redo-outline',
      category: 'privacy',
    },

    // Call Permissions
    initiateCalls: {
      enabled: true,
      label: 'Initiate Calls',
      description: 'Allow members to start voice and video calls',
      icon: 'call-outline',
      category: 'calls',
    },
    joinCalls: {
      enabled: true,
      label: 'Join Calls',
      description: 'Allow members to join ongoing calls',
      icon: 'enter-outline',
      category: 'calls',
    },
    screenShare: {
      enabled: false,
      label: 'Screen Share',
      description: 'Allow members to share their screen during calls',
      icon: 'laptop-outline',
      category: 'calls',
    },

    // Notification Permissions
    muteNotifications: {
      enabled: false,
      label: 'Allow Muting',
      description: 'Allow members to mute group notifications',
      icon: 'notifications-off-outline',
      category: 'notifications',
    },
    customNotifications: {
      enabled: true,
      label: 'Custom Notifications',
      description: 'Allow members to set custom notification tones',
      icon: 'musical-notes-outline',
      category: 'notifications',
    },
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: 'apps-outline' },
    { id: 'messaging', label: 'Messaging', icon: 'chatbubble-outline' },
    { id: 'management', label: 'Management', icon: 'settings-outline' },
    { id: 'privacy', label: 'Privacy', icon: 'shield-checkmark-outline' },
    { id: 'calls', label: 'Calls', icon: 'call-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  ];

  const handleTogglePermission = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
    setHasChanges(true);
  };

  const handleToggleAll = (category) => {
    const categoryPermissions = Object.entries(permissions).filter(
      ([_, value]) => value.category === category
    );
    
    const allEnabled = categoryPermissions.every(([_, value]) => value.enabled);
    
    setPermissions(prev => {
      const updated = { ...prev };
      categoryPermissions.forEach(([key]) => {
        updated[key] = {
          ...updated[key],
          enabled: !allEnabled,
        };
      });
      return updated;
    });
    setHasChanges(true);
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Reset Permissions',
      'Are you sure you want to reset all permissions to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset to initial state
            setPermissions({
              sendMessages: { ...permissions.sendMessages, enabled: true },
              sendMedia: { ...permissions.sendMedia, enabled: true },
              sendVoiceMessages: { ...permissions.sendVoiceMessages, enabled: true },
              sendStickers: { ...permissions.sendStickers, enabled: true },
              sendPolls: { ...permissions.sendPolls, enabled: false },
              editGroupInfo: { ...permissions.editGroupInfo, enabled: false },
              addMembers: { ...permissions.addMembers, enabled: false },
              removeMembers: { ...permissions.removeMembers, enabled: false },
              promoteMembers: { ...permissions.promoteMembers, enabled: false },
              viewMembersList: { ...permissions.viewMembersList, enabled: true },
              viewReadReceipts: { ...permissions.viewReadReceipts, enabled: true },
              viewOnlineStatus: { ...permissions.viewOnlineStatus, enabled: true },
              forwardMessages: { ...permissions.forwardMessages, enabled: true },
              initiateCalls: { ...permissions.initiateCalls, enabled: true },
              joinCalls: { ...permissions.joinCalls, enabled: true },
              screenShare: { ...permissions.screenShare, enabled: false },
              muteNotifications: { ...permissions.muteNotifications, enabled: false },
              customNotifications: { ...permissions.customNotifications, enabled: true },
            });
            setHasChanges(false);
          },
        },
      ]
    );
  };

  const handleSaveChanges = () => {
    // In a real app, call API to save permissions
    Alert.alert(
      'Success',
      'Group permissions have been updated successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            setHasChanges(false);
            navigation.back();
          },
        },
      ]
    );
  };

  const filteredPermissions = Object.entries(permissions).filter(
    ([_, value]) => selectedCategory === 'all' || value.category === selectedCategory
  );

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return Object.keys(permissions).length;
    return Object.values(permissions).filter(p => p.category === categoryId).length;
  };

  const getEnabledCount = (categoryId) => {
    const perms = categoryId === 'all' 
      ? Object.values(permissions)
      : Object.values(permissions).filter(p => p.category === categoryId);
    return perms.filter(p => p.enabled).length;
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Group Permissions</Text>
          <Text style={styles.headerSubtitle}>{groupName}</Text>
        </View>
        {hasChanges && (
          <TouchableOpacity
            style={styles.saveHeaderButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveHeaderText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Icon name="information-circle-outline" size={20} color="#1976D2" />
        <Text style={styles.infoBannerText}>
          Changes will affect all non-admin members
        </Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon}
                size={18}
                color={selectedCategory === category.id ? '#fff' : '#075E54'}
              />
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.categoryTabTextActive,
                ]}
              >
                {category.label}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getEnabledCount(category.id)}/{getCategoryCount(category.id)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Permissions List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedCategory !== 'all' && (
          <TouchableOpacity
            style={styles.toggleAllButton}
            onPress={() => handleToggleAll(selectedCategory)}
          >
            <Icon name="swap-horizontal-outline" size={20} color="#075E54" />
            <Text style={styles.toggleAllText}>
              Toggle All "{categories.find(c => c.id === selectedCategory)?.label}" Permissions
            </Text>
          </TouchableOpacity>
        )}

        {filteredPermissions.map(([key, permission]) => (
          <View key={key} style={styles.permissionItem}>
            <View style={styles.permissionLeft}>
              <View style={styles.permissionIconContainer}>
                <Icon name={permission.icon} size={22} color="#075E54" />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionLabel}>{permission.label}</Text>
                <Text style={styles.permissionDescription}>
                  {permission.description}
                </Text>
              </View>
            </View>
            <Switch
              value={permission.enabled}
              onValueChange={() => handleTogglePermission(key)}
              trackColor={{ false: '#E0E0E0', true: '#A8D08D' }}
              thumbColor={permission.enabled ? '#075E54' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetToDefault}
        >
          <Icon name="refresh-outline" size={20} color="#666" />
          <Text style={styles.resetText}>Reset to Default</Text>
        </TouchableOpacity>

        {hasChanges && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Icon name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 50,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A8D08D',
    marginTop: 2,
  },
  saveHeaderButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  saveHeaderText: {
    color: '#075E54',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
  },
  infoBannerText: {
    fontSize: 13,
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryTabActive: {
    backgroundColor: '#075E54',
    borderColor: '#075E54',
  },
  categoryTabText: {
    fontSize: 13,
    color: '#075E54',
    fontWeight: '600',
    marginLeft: 5,
  },
  categoryTabTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  toggleAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#075E54',
    borderStyle: 'dashed',
  },
  toggleAllText: {
    fontSize: 14,
    color: '#075E54',
    fontWeight: '600',
    marginLeft: 10,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginHorizontal: 15,
    marginBottom: 1,
  },
  permissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  permissionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  resetText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#075E54',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default GroupPermissions;