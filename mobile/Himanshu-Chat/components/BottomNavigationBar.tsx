import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";

const BottomNavigationBar = () => {
  const router = useRouter();
  
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('ChatList')}
      >
        <Icon name="chatbubbles" size={24} color="#075E54" />
        <Text style={[styles.navText]}>Chats</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('StatusList')}
      >
        <Icon name="time-outline" size={24} color="#999" />
        <Text style={[styles.navText]}>Status</Text>
      </TouchableOpacity>
      
      {/* <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('BroadcastList')}
      >
        <Icon name="megaphone-outline" size={24} color="#999" />
        <Text style={styles.navText}>Community</Text>
      </TouchableOpacity>
       */}
      {/* <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('BusinessProfile')}
      >
        <Icon name="briefcase-outline" size={24} color="#999" />
        <Text style={styles.navText}>Business</Text>
      </TouchableOpacity>
       */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('Profile')}
      >
        <Icon name="person-circle-outline" size={24} color="#999" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
{/*       
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('Admin')}
      >
        <Icon name="shield-checkmark-outline" size={24} color="#999" />
        <Text style={styles.navText}>Admin</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default BottomNavigationBar;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#075E54',
    fontWeight: 'bold',
  },
});