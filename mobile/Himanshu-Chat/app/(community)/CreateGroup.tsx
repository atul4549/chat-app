import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import useChatStore from '../../store/chatStore';
import { useRouter } from 'expo-router';

const CreateGroup = () => {
  const navigation = useRouter()
  const { contacts, user } = useChatStore() as {contacts: any, user: any};
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Add Members
  const [groupType, setGroupType] = useState('group'); // 'group' or 'broadcast'

  const filteredContacts = contacts.filter(
    (contact: any) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      contact.id !== user.id
  );

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setGroupImage(response.assets[0].uri);
        }
      }
    );
  };

  const toggleMember = (contact: any) => {
    setSelectedMembers((prev: any[]) => {
      const isSelected = prev.find((m) => m.id === contact.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length < 2) {
      Alert.alert('Error', 'Please select at least 2 members');
      return;
    }

    // In a real app, you would call an API here
    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      image: groupImage,
      members: selectedMembers,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      type: groupType,
      memberCount: selectedMembers.length,
    };

    console.log('New group created:', newGroup);
    
    Alert.alert(
      'Success',
      `Group "${groupName}" created with ${selectedMembers.length} members`,
      [
        {
          text: 'OK',
          onPress: () => navigation.back(),
        },
      ]
    );
  };

  const isFormValid = () => {
    return groupName.trim() && selectedMembers.length >= 2;
  };

  const renderMemberItem = ({ item }) => {
    const isSelected = selectedMembers.find((m) => m.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.memberItem, isSelected && styles.memberItemSelected]}
        onPress={() => toggleMember(item)}
        activeOpacity={0.7}
      >
        <View style={styles.memberLeft}>
          <View style={styles.memberAvatar}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberPhone}>{item.phone}</Text>
          </View>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Icon name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedMembers = () => (
    <View style={styles.selectedMembersSection}>
      <Text style={styles.sectionLabel}>
        Members ({selectedMembers.length})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectedMembersList}
      >
        {selectedMembers.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={styles.selectedMemberChip}
            onPress={() => toggleMember(member)}
          >
            <View style={styles.chipAvatar}>
              <Text style={styles.chipAvatarText}>
                {member.name.charAt(0)}
              </Text>
            </View>
            <Text style={styles.chipName} numberOfLines={1}>
              {member.name}
            </Text>
            <Icon name="close-circle" size={16} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      {/* Group Image */}
      <TouchableOpacity
        onPress={handleSelectImage}
        style={styles.imageContainer}
      >
        {groupImage ? (
          <Image source={{ uri: groupImage }} style={styles.groupImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="camera-outline" size={40} color="#075E54" />
            <Text style={styles.imagePlaceholderText}>Add Group Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Group Type Selection */}
      <View style={styles.typeContainer}>
        <Text style={styles.sectionLabel}>Group Type</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              groupType === 'group' && styles.typeButtonActive,
            ]}
            onPress={() => setGroupType('group')}
          >
            <Icon
              name="people"
              size={24}
              color={groupType === 'group' ? '#fff' : '#075E54'}
            />
            <Text
              style={[
                styles.typeButtonText,
                groupType === 'group' && styles.typeButtonTextActive,
              ]}
            >
              Group
            </Text>
            <Text style={styles.typeDescription}>
              Members can message each other
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              groupType === 'broadcast' && styles.typeButtonActive,
            ]}
            onPress={() => setGroupType('broadcast')}
          >
            <Icon
              name="megaphone"
              size={24}
              color={groupType === 'broadcast' ? '#fff' : '#075E54'}
            />
            <Text
              style={[
                styles.typeButtonText,
                groupType === 'broadcast' && styles.typeButtonTextActive,
              ]}
            >
              Broadcast
            </Text>
            <Text style={styles.typeDescription}>
              One-way announcements
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Group Name */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Group Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
          maxLength={50}
          placeholderTextColor="#999"
        />
        <Text style={styles.charCount}>{groupName.length}/50</Text>
      </View>

      {/* Group Description */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add group description"
          value={groupDescription}
          onChangeText={setGroupDescription}
          multiline
          numberOfLines={3}
          maxLength={200}
          placeholderTextColor="#999"
        />
        <Text style={styles.charCount}>{groupDescription.length}/200</Text>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderSelectedMembers()}

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No contacts found</Text>
          </View>
        }
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (currentStep === 2) {
              setCurrentStep(1);
            } else {
              navigation.back();
            }
          }}
          style={styles.headerButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <TouchableOpacity
          style={[styles.step, currentStep >= 1 && styles.stepActive]}
          onPress={() => setCurrentStep(1)}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Group Info</Text>
        </TouchableOpacity>
        <View style={styles.stepConnector} />
        <TouchableOpacity
          style={[styles.step, currentStep >= 2 && styles.stepActive]}
          onPress={() => {
            if (groupName.trim()) {
              setCurrentStep(2);
            }
          }}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Add Members</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {currentStep === 1 ? renderStep1() : renderStep2()}

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        {currentStep === 1 ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !groupName.trim() && styles.buttonDisabled,
            ]}
            onPress={() => setCurrentStep(2)}
            // disabled={!groupName.trim()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.createButton,
              !isFormValid() && styles.buttonDisabled,
            ]}
            onPress={handleCreateGroup}
            disabled={!isFormValid()}
          >
            <Text style={styles.createButtonText}>
              Create Group ({selectedMembers.length} members)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#F5F5F5',
  },
  step: {
    alignItems: 'center',
  },
  stepActive: {
    opacity: 1,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepNumberText: {
    color: '#999',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    color: '#999',
  },
  // stepActive: {
  //   opacity: 1,
  // },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  stepContent: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#075E54',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#075E54',
    marginTop: 5,
  },
  typeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#075E54',
    borderColor: '#075E54',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#075E54',
    marginTop: 5,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  typeDescription: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  selectedMembersSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  selectedMembersList: {
    maxHeight: 80,
  },
  selectedMemberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  chipAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chipAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chipName: {
    fontSize: 12,
    color: '#075E54',
    fontWeight: '600',
    marginRight: 5,
    maxWidth: 80,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberItemSelected: {
    backgroundColor: '#F0F7F0',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 13,
    color: '#999',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#075E54',
    borderColor: '#075E54',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  bottomButtons: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#075E54',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#075E54',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#A8D08D',
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default CreateGroup;