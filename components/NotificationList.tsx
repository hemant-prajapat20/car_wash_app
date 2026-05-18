import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchNotifications, markRead, removeNotification, setRefreshing } from '../store/notificationSlice';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Trash2, Check, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react-native';

export const NotificationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, refreshing } = useSelector((state: RootState) => state.notifications);

  const onRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return { icon: <CheckCircle2 size={20} color="#10b981" />, bg: 'bg-emerald-50' };
      case 'warning': return { icon: <AlertTriangle size={20} color="#f59e0b" />, bg: 'bg-amber-50' };
      case 'error': return { icon: <XCircle size={20} color="#f43f5e" />, bg: 'bg-rose-50' };
      default: return { icon: <Info size={20} color="#3b82f6" />, bg: 'bg-blue-50' };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const { icon, bg } = getIcon(item.status);
    
    return (
      <Pressable 
        onPress={() => !item.isRead && dispatch(markRead(item._id))}
        className={`bg-white border rounded-[28px] p-5 mb-3 flex-row gap-4 shadow-sm ${!item.isRead ? 'border-blue-200 bg-blue-50/20 border-l-4' : 'border-slate-100'}`}
      >
        <View className={`w-12 h-12 rounded-2xl items-center justify-center shadow-sm ${bg}`}>
          {icon}
        </View>
        
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <Text className={`text-sm ${!item.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`} numberOfLines={1}>
                {item.title}
              </Text>
              {!item.isRead && <View className="w-2 h-2 bg-blue-600 rounded-full" />}
            </View>
            <Text className="text-[10px] font-bold text-slate-400">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </Text>
          </View>
          
          <Text className={`text-xs leading-5 mb-4 ${!item.isRead ? 'font-bold text-slate-700' : 'font-medium text-slate-400'}`} numberOfLines={2}>
            {item.message}
          </Text>
          
          <View className="flex-row items-center gap-4">
            {!item.isRead && (
              <TouchableOpacity 
                onPress={() => dispatch(markRead(item._id))}
                className="flex-row items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl"
              >
                <Check size={12} color="#3b82f6" />
                <Text className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mark Read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => dispatch(removeNotification(item._id))}
              className="flex-row items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl"
            >
              <Trash2 size={12} color="#f43f5e" />
              <Text className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Alerts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
      }
      ListEmptyComponent={
        <View className="items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
          <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
            <Bell size={32} color="#cbd5e1" />
          </View>
          <Text className="text-lg font-black text-slate-300">All caught up!</Text>
          <Text className="text-xs font-bold text-slate-400 mt-1 text-center px-10">
            No business alerts found in your queue.
          </Text>
        </View>
      }
    />
  );
};
