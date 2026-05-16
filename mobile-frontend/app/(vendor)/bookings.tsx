import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Alert 
} from 'react-native';
import { 
  Calendar, CheckCircle2, XCircle, PlayCircle, 
  Filter, Search, Clock, ChevronRight, AlertCircle, Menu
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function VendorBookings() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/vendor/dashboard');
      if (res.data.success) {
        const sorted = (res.data.data.recentBookings || []).sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookings(sorted);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const response = await api.patch(`/vendor/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        setBookings(prev => prev.map(bk => bk._id === bookingId ? { ...bk, status: newStatus } : bk));
      }
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let bg = 'bg-slate-50', text = 'text-slate-600';
    if (status === 'Pending') { bg = 'bg-amber-50'; text = 'text-amber-600'; }
    if (status === 'Confirmed') { bg = 'bg-blue-50'; text = 'text-blue-600'; }
    if (status === 'In Progress') { bg = 'bg-indigo-50'; text = 'text-indigo-600'; }
    if (status === 'Completed') { bg = 'bg-emerald-50'; text = 'text-emerald-600'; }
    if (status === 'Cancelled') { bg = 'bg-rose-50'; text = 'text-rose-600'; }

    return (
      <View className={`${bg} px-2 py-0.5 rounded-lg border border-transparent`}>
        <Text className={`${text} text-[9px] font-black uppercase tracking-widest`}>{status}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Queue...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
            >
              <Menu size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Booking Queue</Text>
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Live Requests</Text>
            </View>
          </View>
          <HeaderNotificationIcon role="vendor" />
        </View>

        <View className="px-6 py-6 pb-20">
          {bookings.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <Calendar size={48} color="#cbd5e1" className="mb-4 opacity-50" />
              <Text className="text-slate-900 font-bold text-base mb-1">Queue Empty</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8 leading-4">
                No active bookings found. Check back later for new requests.
              </Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
                <View className="flex-row items-start justify-between mb-5">
                  <View className="flex-1 pr-4">
                    <Text className="text-base font-black text-slate-900 leading-tight" numberOfLines={1}>{booking.customer?.fullName}</Text>
                    <Text className="text-[11px] font-bold text-slate-400 tracking-tight mt-1" numberOfLines={1}>{booking.service?.name}</Text>
                  </View>
                  <View className="items-end shrink-0">
                    <StatusBadge status={booking.status} />
                    <Text className="text-lg font-black text-slate-900 mt-2">₹{booking.totalAmount}</Text>
                  </View>
                </View>

                <View className="space-y-3 mb-6 pt-5 border-t border-slate-50">
                  <View className="flex-row items-center gap-3">
                    <View className="w-7 h-7 bg-slate-50 rounded-lg items-center justify-center">
                       <Calendar size={14} color="#64748b" />
                    </View>
                    <Text className="text-xs font-bold text-slate-500">
                      {new Date(booking.slot?.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} at {booking.slot?.time || 'N/A'}
                    </Text>
                  </View>
                  {booking.vehicle && (
                    <View className="flex-row items-center gap-3">
                      <View className="w-7 h-7 bg-blue-50 rounded-lg items-center justify-center">
                         <CheckCircle2 size={14} color="#2563eb" />
                      </View>
                      <Text className="text-xs font-bold text-blue-600" numberOfLines={1}>
                        {booking.vehicle.make} {booking.vehicle.model} • {booking.vehicle.plateNumber}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row gap-3">
                  {booking.status === 'Pending' && (
                    <>
                      <TouchableOpacity 
                        activeOpacity={0.8}
                        disabled={!!actionLoading}
                        onPress={() => handleStatusUpdate(booking._id, 'Confirmed')}
                        className="flex-1 h-14 bg-blue-600 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-200"
                      >
                        {actionLoading === booking._id ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <>
                            <PlayCircle size={18} color="white" />
                            <Text className="text-white text-[11px] font-black uppercase tracking-widest">Accept</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        activeOpacity={0.8}
                        disabled={!!actionLoading}
                        onPress={() => handleStatusUpdate(booking._id, 'Cancelled')}
                        className="h-14 w-14 bg-rose-50 rounded-2xl items-center justify-center border border-rose-100"
                      >
                        <XCircle size={24} color="#e11d48" />
                      </TouchableOpacity>
                    </>
                  )}

                  {booking.status === 'Confirmed' && (
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      disabled={!!actionLoading}
                      onPress={() => handleStatusUpdate(booking._id, 'In Progress')}
                      className="flex-1 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-lg shadow-indigo-100"
                    >
                      {actionLoading === booking._id ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text className="text-white text-[11px] font-black uppercase tracking-widest">Start Service</Text>
                      )}
                    </TouchableOpacity>
                  )}

                  {booking.status === 'In Progress' && (
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      disabled={!!actionLoading}
                      onPress={() => handleStatusUpdate(booking._id, 'Completed')}
                      className="flex-1 h-14 bg-emerald-600 rounded-2xl items-center justify-center shadow-lg shadow-emerald-100"
                    >
                      {actionLoading === booking._id ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text className="text-white text-[11px] font-black uppercase tracking-widest">Mark Completed</Text>
                      )}
                    </TouchableOpacity>
                  )}

                  {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                    <View className="flex-1 h-14 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100">
                      <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Closed Request</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
