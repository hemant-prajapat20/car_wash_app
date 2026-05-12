import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatCard, DashboardCard } from '../../components/admin/DashboardComponents';
import { DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react-native';

export default function VendorRevenue() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Revenue Analytics</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Detailed financial performance of your service center</Text>
      </View>

      <View className="flex-row flex-wrap -m-1 mb-8">
        <StatCard title="Monthly Earnings" value="$12,450" icon={DollarSign} trend="+18%" trendPositive={true} color="#10b981" />
        <StatCard title="Avg. Ticket Size" value="$35.00" icon={TrendingUp} color="#38bdf8" />
      </View>

      <DashboardCard title="Financial Overview">
         <Text className="text-slate-500 text-xs italic">Revenue charts and detailed payment breakdowns will appear here.</Text>
      </DashboardCard>
    </ScrollView>
  );
}
