import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUnreadCount, addNotification } from '../store/notificationSlice';
import { socketService } from '../services/socketService';
import { router } from 'expo-router';
import { Audio } from 'expo-av';

export const HeaderNotificationIcon: React.FC<{ role: 'customer' | 'vendor' }> = ({ role }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const { user } = useSelector((state: RootState) => state.auth);
  const prevCountRef = useRef(unreadCount);

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/notification.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      playNotificationSound();
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    if (user && user._id) {
      socketService.connect(user._id);
      
      socketService.onNotification((notification) => {
        dispatch(addNotification(notification));
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, user]);

  return (
    <Pressable 
      onPress={() => {
        const path = role === 'customer' ? '/(customer)/c-notifications' : '/(vendor)/notifications';
        router.push(path as any);
      }}
      className="p-2 mr-2 relative"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100 shadow-sm">
        <Bell size={20} color="#0f172a" />
      </View>
      {unreadCount > 0 && (
        <View className="absolute top-1 right-1 bg-rose-500 min-w-[18px] h-[18px] rounded-full justify-center items-center border-2 border-white">
          <Text className="text-white text-[8px] font-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
