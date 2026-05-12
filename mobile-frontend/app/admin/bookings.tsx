import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';
import { Calendar, Filter, Search } from 'lucide-react-native';

export default function AdminBookings() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Bookings</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Monitor all service transactions across the network</Text>
      </View>

      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 flex-row items-center gap-3">
           <Search size={18} color="#0ea5e9" />
           <TextInput 
             className="flex-1 text-slate-900 font-inter-medium text-sm"
             placeholder="Search bookings..."
             placeholderTextColor="#94a3b8"
           />
        </View>
        <View className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
           <Filter size={18} color="#64748b" />
        </View>
      </View>

      <DashboardCard title="Real-time Feed">
         <Text className="text-slate-500 text-xs text-center py-10 italic">Aggregating live booking data from all vendor nodes...</Text>
      </DashboardCard>
    </ScrollView>
  );
}
