import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { NotificationList } from '../../components/NotificationList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchNotifications, markAllRead } from '../../store/notificationSlice';
import { CheckCircle2, Bell, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';

export default function VendorNotificationsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    dispatch(markAllRead());
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-slate-50">
        <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
            >
              <Menu size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Vendor Alerts</Text>
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business Notifications</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleMarkAllRead}
            className={`px-3 py-1.5 rounded-xl flex-row items-center gap-2 ${unreadCount > 0 ? 'bg-emerald-50' : 'bg-slate-50 opacity-50'}`}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 size={16} color={unreadCount > 0 ? '#059669' : '#94a3b8'} />
            <Text className={`text-[10px] font-black uppercase tracking-widest ${unreadCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
              Read All
            </Text>
          </TouchableOpacity>
        </View>
        
        <NotificationList />
      </View>
    </SafeAreaView>
  );
}
