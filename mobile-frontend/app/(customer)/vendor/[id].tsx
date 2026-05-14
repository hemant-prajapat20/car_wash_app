import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Star, Clock, ShieldCheck } from 'lucide-react-native';

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Vendor Details</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="h-48 bg-slate-100 rounded-[40px] items-center justify-center border border-slate-200 mb-6">
          <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vendor Showcase Image</Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-[10px] font-bold uppercase">Verified</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-slate-900 font-bold text-sm">4.9 (120+ Reviews)</Text>
            </View>
          </View>
          <Text className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Details Loading...</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <MapPin size={16} color="#64748b" />
            <Text className="text-slate-500 font-medium">Fetching precise location...</Text>
          </View>
        </View>

        <View className="bg-slate-900 p-6 rounded-[32px] mb-10">
          <View className="flex-row items-center gap-4">
             <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center">
                <Clock color="white" size={24} />
             </View>
             <View>
                <Text className="text-white font-bold text-lg">Next Available Slot</Text>
                <Text className="text-blue-200 text-xs font-medium">Today, 02:00 PM - 03:00 PM</Text>
             </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-6 border-t border-slate-100 bg-white">
         <TouchableOpacity className="bg-blue-600 h-14 rounded-2xl items-center justify-center shadow-xl shadow-blue-100">
            <Text className="text-white font-bold text-lg">Choose Services</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
