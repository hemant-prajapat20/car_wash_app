import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart3, TrendingUp, Download, PieChart, Activity } from 'lucide-react-native';

const REVENUE_STATS = [
  { day: 'Mon', value: 450 }, { day: 'Tue', value: 520 }, { day: 'Wed', value: 380 },
  { day: 'Thu', value: 650 }, { day: 'Fri', value: 890 }, { day: 'Sat', value: 1200 },
  { day: 'Sun', value: 950 },
];

export default function VendorReports() {
  const maxRevenue = 1200;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Business Analytics</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth performance & metrics</Text>
          </View>
          <TouchableOpacity className="flex-row items-center gap-2 bg-slate-900 px-4 py-2.5 rounded-xl shadow-sm">
            <Download size={14} color="white" />
            <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Export</Text>
          </TouchableOpacity>
        </View>

        {/* Revenue Chart Box */}
        <View className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-8">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center">
                <BarChart3 size={24} color="#059669" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900 uppercase tracking-tight">Weekly Revenue</Text>
                <Text className="text-[10px] font-medium text-slate-400 mt-0.5">Total earnings this week</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp size={14} color="#059669" />
              <Text className="text-[11px] font-bold text-emerald-600">+12.5%</Text>
            </View>
          </View>

          <View className="h-48 flex-row items-end justify-between gap-2 px-2">
            {REVENUE_STATS.map((stat, i) => (
              <View key={i} className="flex-1 items-center justify-end h-full">
                <View 
                  className="w-full bg-slate-100 rounded-lg mb-3"
                  style={{ height: `${(stat.value / maxRevenue) * 100}%` }}
                >
                  <View className="absolute top-0 bottom-0 left-0 right-0 bg-blue-600 rounded-lg opacity-0" />
                </View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Analytic Cards */}
        <View className="flex-row flex-wrap justify-between pb-10">
          {[
            { label: 'Popular Package', value: 'Express Wash', sub: '42% Volume', icon: Activity, color: '#2563eb', bg: 'bg-blue-50' },
            { label: 'Avg. Rating', value: '4.8 / 5.0', sub: '210 Reviews', icon: BarChart3, color: '#d97706', bg: 'bg-amber-50' },
            { label: 'Retention', value: '68%', sub: 'Returning', icon: PieChart, color: '#059669', bg: 'bg-emerald-50' },
          ].map((insight, i) => (
            <View key={i} className="w-full bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm mb-4">
              <View className="flex-row items-center gap-3 mb-3">
                <View className={`${insight.bg} w-10 h-10 rounded-xl items-center justify-center`}>
                  <insight.icon size={20} color={insight.color} />
                </View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.label}</Text>
              </View>
              <Text className="text-lg font-bold text-slate-900 tracking-tight">{insight.value}</Text>
              <Text className="text-[11px] font-medium text-slate-500 mt-1">{insight.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
