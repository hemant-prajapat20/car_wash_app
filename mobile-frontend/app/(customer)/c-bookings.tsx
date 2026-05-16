import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight, Package, Menu, Search, AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchBookings = async () => {
    try {
      const response = await api.get('/customer/my-bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let bg = 'bg-slate-100', text = 'text-slate-600', icon = AlertCircle;
    if (status === 'Completed') { bg = 'bg-emerald-50'; text = 'text-emerald-600'; }
    if (status === 'Pending') { bg = 'bg-amber-50'; text = 'text-amber-600'; }
    if (status === 'In Progress') { bg = 'bg-blue-50'; text = 'text-blue-600'; }
    if (status === 'Confirmed') { bg = 'bg-indigo-50'; text = 'text-indigo-600'; }
    if (status === 'Cancelled') { bg = 'bg-rose-50'; text = 'text-rose-600'; }

    return (
      <View className={`${bg} px-3 py-1 rounded-full border border-transparent`}>
        <Text className={`${text} text-[9px] font-black uppercase tracking-widest`}>{status}</Text>
      </View>
    );
  };

  const renderBooking = ({ item }: { item: any }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      className="bg-white mx-6 mb-5 p-7 rounded-[40px] border border-slate-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1 pr-4">
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Active Order</Text>
          <Text className="text-xl font-black text-slate-900 tracking-tighter" numberOfLines={1}>{item.service?.name || 'General Wash'}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
             <Calendar size={18} color="#2563eb" />
          </View>
          <View>
            <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scheduled For</Text>
            <Text className="text-sm font-bold text-slate-700">
              {new Date(item.slot?.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
             <Clock size={18} color="#2563eb" />
          </View>
          <View>
            <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Slot</Text>
            <Text className="text-sm font-bold text-slate-700">{item.slot?.time || 'Flexible'}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-5 border-t border-slate-50">
        <View className="flex-row items-center gap-3">
           <View className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-sm">
              <Package size={18} color="white" />
           </View>
           <View>
             <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Pay</Text>
             <Text className="text-lg font-black text-slate-900 tracking-tighter">₹{item.totalAmount || '0'}</Text>
           </View>
        </View>
        <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
           <ChevronRight size={20} color="#94a3b8" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-white pt-4 pb-6 px-6 shadow-sm shadow-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
          >
            <Menu size={22} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">My Bookings</Text>
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Order History</Text>
          </View>
        </View>
        <HeaderNotificationIcon role="customer" />
      </View>

      <View className="bg-slate-50 flex-1">
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
             <ActivityIndicator color="#2563eb" size="large" />
             <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Retrieving Orders...</Text>
          </View>
        ) : (
          <FlatList 
            data={bookings}
            renderItem={renderBooking}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-24 px-10">
                 <View className="w-24 h-24 bg-white rounded-[40px] items-center justify-center mb-6 shadow-sm">
                    <Calendar size={40} color="#cbd5e1" />
                 </View>
                 <Text className="text-slate-900 font-black text-xl text-center">No Bookings Yet</Text>
                 <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2 text-center leading-4">
                    Your scheduled car care services will appear here once you place an order.
                 </Text>
                 <TouchableOpacity 
                   onPress={() => navigation.navigate('search' as never)}
                   className="mt-8 bg-blue-600 px-6 py-3 rounded-2xl shadow-lg shadow-blue-200"
                 >
                    <Text className="text-white font-black text-[10px] uppercase tracking-widest">Find Centers</Text>
                 </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
