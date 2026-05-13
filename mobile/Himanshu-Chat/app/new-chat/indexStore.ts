import { create } from 'zustand';
import Toast from 'react-native-toast-message';
import { axiosInstance } from '../../lib/axios';
// Create a store for search functionality
const useSearchStore = create((set, get) => ({
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    recentSearches: [],
    isLoading: false,
    
    setSearchQuery: (query) => set({ searchQuery: query }),
    
    searchUsers: async (query) => {
    //   if (!query.trim()) {
    //     set({ searchResults: [], isLoading: false });
    //     return;
    //   }
      
      set({ isLoading: true });
      try {
        const response = await axiosInstance.get(`/users/search?q=${query}`);
        set({ searchResults: response.data });
        
        // Save to recent searches
        const { recentSearches } = get();
        if (query.trim() && !recentSearches.includes(query)) {
          set({ recentSearches: [query, ...recentSearches].slice(0, 5) });
        }
      } catch (error) {
        console.error('Search error:', error);
        Toast.show({
          type: 'error',
          text1: 'Search Failed',
          text2: error.response?.data?.message || 'Failed to search users',
          position: 'bottom',
        });
        set({ searchResults: [] });
      } finally {
        set({ isLoading: false });
      }
    },
    
    clearSearch: () => {
      set({ searchQuery: '', searchResults: [], isLoading: false });
    },
    
    clearRecentSearches: () => {
      set({ recentSearches: [] });
    },
  }));
export default useSearchStore