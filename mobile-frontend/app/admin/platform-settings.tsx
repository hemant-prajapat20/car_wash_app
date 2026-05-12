import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';
import { Server, Globe, Database, Cpu } from 'lucide-react-native';

export default function PlatformSettings() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Platform Configuration</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Manage global system variables and server environment</Text>
      </View>

      <DashboardCard title="Core Engine Settings">
        <View className="space-y-4">
           {[
             { label: 'API Base URL', value: 'https://api.aquawash.saas', icon: Globe },
             { label: 'Database Node', value: 'MongoDB Cluster-0 (AWS)', icon: Database },
             { label: 'System Cache', value: 'Redis-v7.2 (Enabled)', icon: Cpu },
           ].map((item, i) => (
              <View key={i} className="flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <View className="flex-row items-center gap-3">
                    <item.icon size={18} color="#0ea5e9" />
                    <Text className="text-slate-900 font-inter-semibold text-sm">{item.label}</Text>
                 </View>
                 <Text className="text-slate-500 text-xs">{item.value}</Text>
              </View>
           ))}
        </View>
      </DashboardCard>
    </ScrollView>
  );
}
