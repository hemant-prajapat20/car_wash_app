import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';
import { Shield, Lock, Eye, Key } from 'lucide-react-native';

export default function AdminSecurity() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Security & Access</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Platform-wide security protocols and monitoring</Text>
      </View>

      <View className="space-y-6">
        <DashboardCard title="Access Logs" subtitle="Recent administrative login attempts">
          <Text className="text-slate-500 text-xs italic">Encrypted security logs are only visible to verified system architects.</Text>
        </DashboardCard>
                <View className="flex-row gap-4">
            <View className="flex-1 bg-white border border-slate-100 p-6 rounded-3xl items-center shadow-sm">
               <Shield size={32} color="#0ea5e9" />
               <Text className="text-slate-900 font-inter-bold mt-4">Firewall: Active</Text>
            </View>
            <View className="flex-1 bg-white border border-slate-100 p-6 rounded-3xl items-center shadow-sm">
               <Key size={32} color="#10b981" />
               <Text className="text-slate-900 font-inter-bold mt-4">2FA: Enabled</Text>
            </View>
         </View>
      </View>
    </ScrollView>
  );
}
