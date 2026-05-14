import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Calendar, CheckCircle2, XCircle, PlayCircle, Filter } from 'lucide-react-native';
import api from '../../services/api';

export default function VendorBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/vendor/dashboard');
      if (res.data.success) {
        setBookings(res.data.data.recentBookings || []);
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
      <View className={`${bg} px-2 py-1 rounded-md`}>
        <Text className={`${text} text-[10px] font-bold uppercase tracking-widest`}>{status}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Queue...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="pt-6 pb-4 px-6 flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-slate-900 tracking-tight">Booking Queue</Text>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage live requests</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-white border border-slate-200 rounded-xl items-center justify-center shadow-sm">
          <Filter size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="px-6 pb-10">
        {bookings.length === 0 ? (
          <View className="items-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm mt-4">
            <Calendar size={48} color="#cbd5e1" className="mb-4" />
            <Text className="text-slate-900 font-bold text-base mb-1">Queue Empty</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
              No active bookings found for your center.
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking._id} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm mt-4">
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-bold text-slate-900 leading-tight" numberOfLines={1}>{booking.customer?.fullName}</Text>
                  <Text className="text-[11px] font-bold text-slate-400 tracking-tight mt-1" numberOfLines={1}>{booking.service?.name}</Text>
                </View>
                <View className="items-end shrink-0">
                  <StatusBadge status={booking.status} />
                  <Text className="text-sm font-bold text-slate-900 mt-2">₹{booking.totalAmount}</Text>
                </View>
              </View>

              <View className="space-y-3 mb-5 pt-4 border-t border-slate-50">
                <View className="flex-row items-center gap-3">
                  <Calendar size={14} color="#64748b" />
                  <Text className="text-xs font-bold text-slate-500">
                    {new Date(booking.slot?.date || new Date()).toLocaleDateString()} at {booking.slot?.time || 'N/A'}
                  </Text>
                </View>
                {booking.vehicle && (
                  <View className="flex-row items-center gap-3">
                    <CheckCircle2 size={14} color="#2563eb" />
                    <Text className="text-xs font-bold text-blue-600">
                      {booking.vehicle.make} {booking.vehicle.model} • {booking.vehicle.plateNumber}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row gap-3">
                {booking.status === 'Pending' && (
                  <>
                    <TouchableOpacity 
                      disabled={!!actionLoading}
                      onPress={() => handleStatusUpdate(booking._id, 'Confirmed')}
                      className="flex-1 h-12 bg-blue-600 rounded-xl items-center justify-center flex-row gap-2"
                    >
                      {actionLoading === booking._id ? <ActivityIndicator color="white" size="small" /> : <PlayCircle size={16} color="white" />}
                      <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      disabled={!!actionLoading}
                      onPress={() => handleStatusUpdate(booking._id, 'Cancelled')}
                      className="h-12 w-12 bg-rose-50 rounded-xl items-center justify-center"
                    >
                      <XCircle size={20} color="#e11d48" />
                    </TouchableOpacity>
                  </>
                )}

                {booking.status === 'Confirmed' && (
                  <TouchableOpacity 
                    disabled={!!actionLoading}
                    onPress={() => handleStatusUpdate(booking._id, 'In Progress')}
                    className="flex-1 h-12 bg-indigo-600 rounded-xl items-center justify-center"
                  >
                    {actionLoading === booking._id ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Start Service</Text>}
                  </TouchableOpacity>
                )}

                {booking.status === 'In Progress' && (
                  <TouchableOpacity 
                    disabled={!!actionLoading}
                    onPress={() => handleStatusUpdate(booking._id, 'Completed')}
                    className="flex-1 h-12 bg-emerald-600 rounded-xl items-center justify-center"
                  >
                    {actionLoading === booking._id ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Mark Completed</Text>}
                  </TouchableOpacity>
                )}

                {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                  <View className="flex-1 h-12 bg-slate-50 rounded-xl items-center justify-center">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Closed Request</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
