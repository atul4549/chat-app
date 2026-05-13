// // multiple channels
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import React from 'react'
// import  { useRouter } from 'expo-router' 
// const BroadcastList = () => {
//   const router = useRouter()
//   return (
//     <View>
//       <Text>BroadcastList</Text>
      
//     <TouchableOpacity
//       onPress={() => router.push('CreateGroup')}>
//       <Text style={styles.navText}>Create</Text>
//     </TouchableOpacity>
//     <TouchableOpacity
//       onPress={() => router.push('GroupInfo')}>
//       <Text style={styles.navText}>Info</Text>
//     </TouchableOpacity>
//     <TouchableOpacity
//       onPress={() => router.push('GroupPermissions')}>
//       <Text style={styles.navText}>Permission</Text>
//     </TouchableOpacity>
//     </View>
//   )
// }

// export default BroadcastList

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BroadcastList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy static data for broadcast channels
  const [broadcasts, setBroadcasts] = useState([
    {
      id: '1',
      name: 'Announcements',
      description: 'Important company updates and announcements',
      memberCount: 245,
      createdAt: '2024-01-15',
      isActive: true,
      icon: 'megaphone',
      color: '#FF6B6B',
    },
    {
      id: '2',
      name: 'Tech News',
      description: 'Latest technology news and trends',
      memberCount: 189,
      createdAt: '2024-02-10',
      isActive: true,
      icon: 'hardware-chip',
      color: '#4ECDC4',
    },
    {
      id: '3',
      name: 'Event Updates',
      description: 'Upcoming events and meetups',
      memberCount: 432,
      createdAt: '2024-01-20',
      isActive: true,
      icon: 'calendar',
      color: '#FFE66D',
    },
    {
      id: '4',
      name: 'Product Updates',
      description: 'New features and product releases',
      memberCount: 567,
      createdAt: '2024-02-01',
      isActive: false,
      icon: 'rocket',
      color: '#A8E6CF',
    },
    {
      id: '5',
      name: 'Marketing Tips',
      description: 'Weekly marketing strategies and tips',
      memberCount: 123,
      createdAt: '2024-02-18',
      isActive: true,
      icon: 'trending-up',
      color: '#FFD93D',
    },
  ]);

  // Filter broadcasts based on search
  const filteredBroadcasts = broadcasts.filter(broadcast =>
    broadcast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    broadcast.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBroadcastItem = ({ item }) => (
    <TouchableOpacity
      style={styles.broadcastCard}
      onPress={() => router.push({
        pathname: 'BroadcastDetail',
        params: { id: item.id, name: item.name }
      })}
    >
      <View style={[styles.broadcastIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={32} color={item.color} />
      </View>
      
      <View style={styles.broadcastInfo}>
        <View style={styles.broadcastHeader}>
          <Text style={styles.broadcastName}>{item.name}</Text>
          {item.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.broadcastDescription}>{item.description}</Text>
        
        <View style={styles.broadcastStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={14} color="#999" />
            <Text style={styles.statText}>{item.memberCount} members</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={14} color="#999" />
            <Text style={styles.statText}>Created {item.createdAt}</Text>
          </View>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#075E54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast Channels</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('CreateBroadcast')}
        >
          <Ionicons name="add" size={28} color="#075E54" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search broadcasts..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsSummary}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{broadcasts.length}</Text>
          <Text style={styles.statLabel}>Total Channels</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {broadcasts.filter(b => b.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {broadcasts.reduce((sum, b) => sum + b.memberCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Members</Text>
        </View>
      </View>

      {/* Broadcast List */}
      <FlatList
        data={filteredBroadcasts}
        renderItem={renderBroadcastItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>No broadcast channels found</Text>
            <TouchableOpacity 
              style={styles.createBroadcastButton}
              onPress={() => router.push('CreateBroadcast')}
            >
              <Text style={styles.createBroadcastText}>Create your first broadcast</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Quick Actions Menu */}
      {/* <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('CreateBroadcast')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#075E54" />
          <Text style={styles.actionText}>Create</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('BroadcastInfo')}
        >
          <Ionicons name="information-circle-outline" size={24} color="#075E54" />
          <Text style={styles.actionText}>Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('BroadcastPermissions')}
        >
          <Ionicons name="settings-outline" size={24} color="#075E54" />
          <Text style={styles.actionText}>Permissions</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default BroadcastList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#075E54',
  },
  createButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#075E54',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  broadcastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  broadcastIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  broadcastInfo: {
    flex: 1,
  },
  broadcastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  broadcastName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  broadcastDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  broadcastStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  createBroadcastButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#075E54',
    borderRadius: 20,
  },
  createBroadcastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#075E54',
    marginTop: 4,
  },
});