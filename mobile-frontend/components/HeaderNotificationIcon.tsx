import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUnreadCount, addNotification } from '../store/notificationSlice';
import { socketService } from '../services/socketService';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { useRef } from 'react';

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
      onPress={() => router.push(`/${role}/notifications`)}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 }
      ]}
    >
      <Ionicons name="notifications-outline" size={24} color="#475569" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f43f5e',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  }
});
