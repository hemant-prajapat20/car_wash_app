import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useRootNavigationState, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { store, RootState, AppDispatch } from '../store';
import { loadAuth } from '../store/authSlice';
import "../global.css";

function InitialLayout() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const navigationState = useRootNavigationState();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the auth to load and the navigation to be ready
    const init = async () => {
      await dispatch(loadAuth());
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    // CRITICAL: Only navigate when BOTH auth is loaded AND navigation is mounted
    if (!isReady || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inVendorGroup = segments[0] === '(vendor)';
    const isLandingPage = !inAuthGroup && !inCustomerGroup && !inVendorGroup;

    if (!token) {
      if (!inAuthGroup && !isLandingPage) {
        router.replace('/(auth)/login');
      }
    } else if (token && user) {
      if (inAuthGroup || isLandingPage) {
        if (user.role === 'vendor') router.replace('/(vendor)/dashboard');
        else router.replace('/(customer)/search');
      } else if (user.role === 'customer' && inVendorGroup) {
        router.replace('/(customer)/search');
      } else if (user.role === 'vendor' && inCustomerGroup) {
        router.replace('/(vendor)/dashboard');
      }
    }
  }, [token, user, segments, isReady, navigationState?.key]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="(vendor)" />
    </Stack>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <InitialLayout />
          <StatusBar style="auto" />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
