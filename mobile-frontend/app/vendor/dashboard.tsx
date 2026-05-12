import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatCard, DashboardCard } from '../../components/admin/DashboardComponents';
import { CalendarRange, Users, DollarSign, Activity } from 'lucide-react-native';

export default function VendorDashboard() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Vendor Hub</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Operational overview for your service center</Text>
      </View>

      <View className="flex-row flex-wrap -m-1 mb-8">
        <StatCard title="Today's Slots" value="12/20" icon={CalendarRange} trend="60% Full" trendPositive={true} color="#38bdf8" />
        <StatCard title="Active Staff" value="8" icon={Users} color="#a855f7" />
        <StatCard title="Weekly Revenue" value="$4,250" icon={DollarSign} trend="+12%" trendPositive={true} color="#10b981" />
        <StatCard title="Success Rate" value="98%" icon={Activity} color="#f59e0b" />
      </View>

      <DashboardCard title="Quick Actions">
        <View className="flex-row gap-4">
           {/* Add buttons here */}
           <Text className="text-slate-400 text-xs">Manage your business operations from this centralized dashboard.</Text>
        </View>
      </DashboardCard>
    </ScrollView>
  );
}
