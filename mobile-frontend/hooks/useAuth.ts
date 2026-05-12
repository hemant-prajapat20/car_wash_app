import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout as logoutAction } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    dispatch(logoutAction());
    router.replace('/(auth)/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
};
