import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, ActivityIndicator } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchNotifications, markRead, removeNotification, setRefreshing } from '../store/notificationSlice';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';

export const NotificationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, refreshing } = useSelector((state: RootState) => state.notifications);

  const onRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return { name: 'checkmark-circle', color: '#10b981' };
      case 'warning': return { name: 'alert-circle', color: '#f59e0b' };
      case 'error': return { name: 'close-circle', color: '#f43f5e' };
      default: return { name: 'information-circle', color: '#3b82f6' };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const icon = getIcon(item.status);
    
    return (
      <View style={[styles.card, !item.isRead && styles.unreadCard]}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
            <Text style={styles.time}>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
          
          <View style={styles.actions}>
            {!item.isRead && (
              <Pressable 
                onPress={() => dispatch(markRead(item._id))}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Mark as read</Text>
              </Pressable>
            )}
            <Pressable 
              onPress={() => dispatch(removeNotification(item._id))}
              style={[styles.actionButton, { marginLeft: 15 }]}
            >
              <Text style={[styles.actionText, { color: '#f43f5e' }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#e2e8f0" />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>We'll alert you when something happens.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadCard: {
    borderColor: '#e0f2fe',
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    color: '#0f172a',
  },
  time: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  message: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#cbd5e1',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 4,
    textAlign: 'center',
  },
});
