import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
// import useChatStore from '@/store/chatStore';
// import useChatStore from '../../store/chatStore'
import  useChatStore  from '../../store/chatStore';
// export default useChatStore;

import { useRouter, useLocalSearchParams } from "expo-router";
const ProfileSetupScreen = () => {
    const navigation = useRouter()
  const { users, updateUser } = useChatStore() as {
    updateUser: void,
    users: any,
  };
  const user = users
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setAvatar(response.assets[0].uri);
        }
      }
    );
  };

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim(), status: status.trim(), avatar });
      navigation.replace('ChatList');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Setup</Text>
        <Text style={styles.subtitle}>
          Add your details to complete setup
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSelectImage}
        style={styles.avatarContainer}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>📷</Text>
          </View>
        )}
        <Text style={styles.addPhotoText}>Add Profile Photo</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          value={status}
          onChangeText={setStatus}
          placeholder="Add a status message"
          placeholderTextColor="#999"
          maxLength={50}
        />
        <Text style={styles.charCount}>{status.length}/50</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Complete Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
  },
  addPhotoText: {
    fontSize: 14,
    color: '#075E54',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#075E54',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#A8D08D',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileSetupScreen;
