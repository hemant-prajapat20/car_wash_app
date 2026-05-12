import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatCard, DashboardCard } from '../../components/admin/DashboardComponents';
import { Search, MapPin, Star, Calendar } from 'lucide-react-native';

export default function CustomerDashboard() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Welcome Back!</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Ready for a sparkling clean ride?</Text>
      </View>

      <View className="flex-row flex-wrap -m-1 mb-8">
        <StatCard title="My Rewards" value="450 pts" icon={Star} trend="+50" trendPositive={true} color="#f59e0b" />
        <StatCard title="Active Bookings" value="1" icon={Calendar} color="#38bdf8" />
        <StatCard title="Saved Locations" value="3" icon={MapPin} color="#10b981" />
      </View>

      <DashboardCard title="Find a Service">
         <View className="bg-slate-50 p-4 rounded-xl flex-row items-center gap-3 border border-slate-100">
            <Search size={18} color="#64748b" />
            <Text className="text-slate-500 text-sm">Search for vendors near you...</Text>
         </View>
      </DashboardCard>
    </ScrollView>
  );
}
