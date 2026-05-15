import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { NotificationList } from '../../components/NotificationList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchNotifications, markAllRead } from '../../store/notificationSlice';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Notifications",
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable 
              onPress={() => dispatch(markAllRead())}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Ionicons name="checkmark-done" size={20} color="#3b82f6" />
            </Pressable>
          ),
        }} 
      />
      
      <NotificationList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  }
});
