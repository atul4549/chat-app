import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
const Header = ({name}) => {
  return (
    <View style={styles.header}>
    <TouchableOpacity
      onPress={() => navigation.back()}
      style={styles.backButton}
    >
      <Icon name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{name}</Text>
    <View style={{ width: 24 }} />
  </View>

  )
}

export default Header

// 
// const styles = StyleSheet.create({})

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