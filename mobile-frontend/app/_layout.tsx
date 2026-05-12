import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, type RootState } from '../store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import "../global.css";
import { authService } from '../services/authService';
import { setCredentials, logout } from '../store/authSlice';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        // Set a hard timeout for the auth check during initialization
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        
        const response: any = await Promise.race([
          authService.getProfile(),
          timeoutPromise
        ]);

        if (isMounted && response?.success && response?.data) {
          dispatch(setCredentials({ user: response.data, token: '' })); 
        }
      } catch (err) {
        console.warn('Auth initialization skipped or timed out');
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const inAuthPage = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password' || segments[0] === 'admin-login';
    const inCustomerGroup = segments[0] === 'customer';
    const inVendorGroup = segments[0] === 'vendor';
    const inAdminGroup = segments[0] === 'admin';

    // 1. Not Authenticated -> Redirect to Login if trying to access protected routes
    if (!isAuthenticated && (inCustomerGroup || inVendorGroup || inAdminGroup)) {
      router.replace('/login');
      return;
    }

    // 2. Authenticated -> Enforce Role-Based Access
    if (isAuthenticated) {
      // If user is on an auth page, redirect them to their respective dashboard
      if (inAuthPage) {
        if (user?.role === 'customer') router.replace('/customer/dashboard');
        else if (user?.role === 'vendor') router.replace('/vendor/dashboard');
        else if (user?.role === 'superAdmin' || user?.role === 'admin') router.replace('/admin/dashboard');
      } 
      // Role mismatch protection
      else if (user?.role === 'customer' && (inVendorGroup || inAdminGroup)) {
        router.replace('/customer/dashboard');
      } else if (user?.role === 'vendor' && (inCustomerGroup || inAdminGroup)) {
        router.replace('/vendor/dashboard');
      } else if ((user?.role === 'superAdmin' || user?.role === 'admin') && (inCustomerGroup || inVendorGroup)) {
        router.replace('/admin/dashboard');
      }
    }
  }, [isAuthenticated, segments, isInitializing, user]);

  if (isInitializing) return null;

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: 'white' }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="admin-login" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="vendor" />
      <Stack.Screen name="customer" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </GestureHandlerRootView>
  );
}
