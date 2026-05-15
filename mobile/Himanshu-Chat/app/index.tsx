import React, { useEffect } from 'react';
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Use router for web, Redirect for native (or just Redirect for both)
  // if (Platform.OS === 'web') {
  //   // For web, you might want to use router
  //   const router = useRouter();
  //   useEffect(() => {
  //     if (authUser) {
  //       router.replace('./(messaging)/ChatList');
  //     } else {
  //       router.replace('./(account)/login');
  //     }
  //   }, [authUser]);
  //   return null;
  // }

  // For native, Redirect works fine
  if (authUser) {
    return <Redirect href="./(messaging)/ChatList" />;
  } else {
    return <Redirect href="./(account)/login" />;
  }
}