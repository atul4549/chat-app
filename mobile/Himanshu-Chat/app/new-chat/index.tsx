import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { 
  ActivityIndicator, 
  Pressable, 
  Text, 
  TextInput, 
  View, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';


import Toast from 'react-native-toast-message';
import styles from './indexStyle'

import useSearchStore from './indexStore'

const NewChatScreen = () => {
  const router = useRouter();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchInputRef = useRef(null);
  
  const { 
    searchResults, 
    isSearching, 
    isLoading, 
    recentSearches,
    searchUsers,
    clearSearch,
    clearRecentSearches
  } = useSearchStore();

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchQuery) {
        searchUsers(localSearchQuery);
        setIsDropdownVisible(true);
      } else {
        searchUsers('');
        if (recentSearches.length > 0) {
          setIsDropdownVisible(true);
        } else {
          setIsDropdownVisible(false);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setLocalSearchQuery(user.name);
    setIsDropdownVisible(false);
    Keyboard.dismiss();
    
    Toast.show({
      type: 'success',
      text1: 'User Selected',
      text2: `Starting chat with ${user.name}`,
      position: 'bottom',
      visibilityTime: 2000,
    });
    
    // Navigate to chat after selection
    setTimeout(() => {
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          isOnline: user.isOnline
        },
      });
    }, 500);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    clearSearch();
    setIsDropdownVisible(false);
    searchInputRef.current?.focus();
  };

  const renderRecentSearch = () => (
    <View style={styles.recentSection}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity onPress={clearRecentSearches}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {recentSearches.map((search, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.recentItem}
          onPress={() => {
            setLocalSearchQuery(search);
            searchUsers(search);
          }}
        >
          <Ionicons name="time-outline" size={18} color="#6B6B70" />
          <Text style={styles.recentText}>{search}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsSection}>
      {!isLoading && searchResults.length === 0 && localSearchQuery && (
        <View style={styles.noResults}>
          <Ionicons name="person-outline" size={48} color="#6B6B70" />
          <Text style={styles.noResultsTitle}>No users found</Text>
          <Text style={styles.noResultsText}>
            Try searching with a different name or email
          </Text>
        </View>
      )}
      
      {searchResults.map((user) => (
        <UserItem
          key={user._id}
          user={user}
          onPress={handleUserSelect}
          isSelected={selectedUser?._id === user._id}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Pressable
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#f4a261" />
            </Pressable>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>New chat</Text>
              <Text style={styles.headerSubtitle}>
                Search for a user to start chatting
              </Text>
            </View>
          </View>

          {/* SEARCH BAR */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#6B6B70" />
              <TextInput
                ref={searchInputRef}
                placeholder="Search users..."
                placeholderTextColor="#6B6B70"
                style={styles.searchInput}
                value={localSearchQuery}
                onChangeText={setLocalSearchQuery}
                onFocus={() => {
                  setIsDropdownVisible(true);
                  if (!localSearchQuery && recentSearches.length > 0) {
                    searchUsers('');
                  }
                }}
                autoCapitalize="none"
              />
              {localSearchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch}>
                  <Ionicons name="close-circle" size={18} color="#6B6B70" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* DROPDOWN / USERS LIST */}
          {isDropdownVisible && (
            <View style={styles.dropdownContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#f4a261" />
                  <Text style={styles.loadingText}>Searching users...</Text>
                </View>
              ) : (
                <ScrollView 
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {!localSearchQuery && recentSearches.length > 0 && renderRecentSearch()}
                  {localSearchQuery && renderSearchResults()}
                  
                  {/* Suggestions */}
                  {!localSearchQuery && recentSearches.length === 0 && (
                    <View style={styles.suggestionsContainer}>
                      <View style={styles.suggestionsHeader}>
                        <Ionicons name="people-outline" size={20} color="#6B6B70" />
                        <Text style={styles.suggestionsTitle}>Suggestions</Text>
                      </View>
                      <Text style={styles.suggestionsText}>
                        Start typing to search for users
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          )}

          {/* EMPTY STATE WHEN NO SEARCH */}
          {!isDropdownVisible && !localSearchQuery && (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#6B6B70" />
              <Text style={styles.emptyTitle}>Find friends</Text>
              <Text style={styles.emptySubtitle}>
                Search for users by name or email to start chatting
              </Text>
            </View>
          )}
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};


export default NewChatScreen;