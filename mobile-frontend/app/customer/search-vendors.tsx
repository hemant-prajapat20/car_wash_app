import React from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { Search, MapPin, Filter, Star } from 'lucide-react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';

export default function SearchVendors() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Find Service Partners</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Discover the best car wash centers near your location</Text>
      </View>

      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex-row items-center gap-3">
           <Search size={20} color="#0ea5e9" />
           <TextInput 
             className="flex-1 text-slate-900 font-inter-medium text-sm"
             placeholder="Search by name or area..."
             placeholderTextColor="#94a3b8"
           />
        </View>
        <View className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
           <Filter size={20} color="#64748b" />
        </View>
      </View>

      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <DashboardCard key={i} className="mb-4 bg-white border border-slate-100">
             <View className="flex-row justify-between items-start">
                <View>
                   <Text className="text-slate-900 font-inter-bold text-lg">Premium Shine {i}</Text>
                   <View className="flex-row items-center gap-2 mt-1">
                      <MapPin size={12} color="#64748b" />
                      <Text className="text-slate-500 text-xs">Downtown Center • 2.4 km</Text>
                   </View>
                </View>
                <View className="bg-amber-500/10 px-2 py-1 rounded-lg flex-row items-center gap-1">
                   <Star size={10} color="#f59e0b" fill="#f59e0b" />
                   <Text className="text-amber-500 font-inter-bold text-[10px]">4.8</Text>
                </View>
             </View>
          </DashboardCard>
        ))}
      </View>
    </ScrollView>
  );
}
