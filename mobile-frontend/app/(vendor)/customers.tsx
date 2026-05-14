import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Users, Search, MoreVertical, Star } from 'lucide-react-native';

const CUSTOMERS = [
  { id: 'C1', name: 'John Jonathan Doe Senior', email: 'john@example.com', bookings: 12, rating: 4.8 },
  { id: 'C2', name: 'Sarah Smith', email: 'sarah@test.com', bookings: 5, rating: 5.0 },
  { id: 'C3', name: 'Mike Ross', email: 'mike.r@legal.com', bookings: 24, rating: 4.2 },
  { id: 'C4', name: 'Rachel Zane', email: 'rachel@zane.com', bookings: 8, rating: 4.9 },
];

export default function VendorCustomers() {
  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Client Directory</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management of your customers</Text>
          </View>
        </View>

        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-12 mb-6 shadow-sm">
          <Search size={16} color="#94a3b8" />
          <TextInput 
            placeholder="Search clients..." 
            className="flex-1 ml-3 text-xs font-semibold text-slate-900"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View className="flex-row flex-wrap justify-between pb-10">
          {CUSTOMERS.map((cust) => (
            <View key={cust.id} className="w-[48%] bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm mb-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center">
                  <Users size={18} color="#2563eb" />
                </View>
                <TouchableOpacity className="p-1">
                  <MoreVertical size={16} color="#cbd5e1" />
                </TouchableOpacity>
              </View>

              <Text className="text-sm font-bold text-slate-900 leading-tight mb-1" numberOfLines={1}>{cust.name}</Text>
              <Text className="text-[10px] font-semibold text-slate-400 mb-4" numberOfLines={1}>{cust.email}</Text>

              <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
                <View>
                  <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bookings</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{cust.bookings}</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                  <Star size={10} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-[10px] font-bold text-amber-700">{cust.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
