import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight, Package } from 'lucide-react-native';
import api from '../../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBooking = ({ item }: { item: any }) => (
    <View className="bg-white mx-6 mb-4 p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-100">
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Order</Text>
          <Text className="text-lg font-bold text-slate-900">{item.service?.name || 'General Wash'}</Text>
        </View>
        <View className={`px-4 py-1.5 rounded-full ${
          item.status === 'Completed' ? 'bg-emerald-50' : 
          item.status === 'Pending' ? 'bg-amber-50' : 'bg-blue-50'
        }`}>
          <Text className={`text-[10px] font-bold uppercase ${
            item.status === 'Completed' ? 'text-emerald-600' : 
            item.status === 'Pending' ? 'text-amber-600' : 'text-blue-600'
          }`}>{item.status}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4 mb-5">
        <View className="flex-row items-center gap-1.5">
           <Calendar size={14} color="#64748b" />
           <Text className="text-slate-500 text-xs font-medium">{item.slot?.date || 'Today'}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
           <Clock size={14} color="#64748b" />
           <Text className="text-slate-500 text-xs font-medium">{item.slot?.time || 'Flexible'}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-4 border-t border-slate-50">
        <View className="flex-row items-center gap-2">
           <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center">
              <Package size={14} color="#0f172a" />
           </View>
           <Text className="text-slate-900 font-bold text-sm">₹{item.totalAmount || '0'}</Text>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1">
           <Text className="text-blue-600 text-[10px] font-bold uppercase">Details</Text>
           <ChevronRight size={14} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 pb-6 px-6">
        <Text className="text-2xl font-bold text-slate-900 tracking-tight">Your Bookings</Text>
        <Text className="text-slate-400 text-xs font-medium mt-1">Manage and track your car wash orders</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
           <ActivityIndicator color="#2563eb" />
        </View>
      ) : (
        <FlatList 
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20 px-10">
               <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-6">
                  <Calendar size={32} color="#94a3b8" />
               </View>
               <Text className="text-slate-900 font-bold text-xl text-center">No Bookings Yet</Text>
               <Text className="text-slate-400 text-sm mt-2 text-center">Your booked services will appear here once you make your first order.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
