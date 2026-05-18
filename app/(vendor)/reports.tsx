import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart3, TrendingUp, Download, PieChart, Activity, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

const REVENUE_STATS = [
  { day: 'Mon', value: 450 }, { day: 'Tue', value: 520 }, { day: 'Wed', value: 380 },
  { day: 'Thu', value: 650 }, { day: 'Fri', value: 890 }, { day: 'Sat', value: 1200 },
  { day: 'Sun', value: 950 },
];

export default function VendorReports() {
  const navigation = useNavigation();
  const maxRevenue = 1200;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-slate-50" 
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
            >
              <Menu size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Analytics</Text>
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Business Intelligence</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="flex-row items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl shadow-lg shadow-slate-200">
              <Download size={14} color="white" />
              <Text className="text-white text-[10px] font-black uppercase tracking-widest">Export</Text>
            </TouchableOpacity>
            <HeaderNotificationIcon role="vendor" />
          </View>
        </View>

        <View className="px-6 pt-6 pb-20">
          {/* Revenue Chart Box */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-10">
              <View className="flex-row items-center gap-3">
                <View className="w-14 h-14 bg-emerald-50 rounded-[20px] items-center justify-center">
                  <BarChart3 size={28} color="#059669" />
                </View>
                <View>
                  <Text className="text-sm font-black text-slate-900 uppercase tracking-tight">Weekly Revenue</Text>
                  <Text className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Current Performance</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <TrendingUp size={14} color="#059669" />
                <Text className="text-[11px] font-black text-emerald-600">+12.5%</Text>
              </View>
            </View>

            <View className="h-56 flex-row items-end justify-between gap-3 px-2">
              {REVENUE_STATS.map((stat, i) => (
                <View key={i} className="flex-1 items-center justify-end h-full">
                  <View 
                    className="w-full bg-slate-50 rounded-2xl mb-4 relative overflow-hidden"
                    style={{ height: `${(stat.value / maxRevenue) * 100}%` }}
                  >
                    <View className="absolute top-0 bottom-0 left-0 right-0 bg-blue-600 rounded-2xl opacity-80" />
                  </View>
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Analytic Cards */}
          <View className="flex-row flex-wrap justify-between">
            {[
              { label: 'Popular Package', value: 'Express Wash', sub: '42% Volume', icon: Activity, color: '#2563eb', bg: 'bg-blue-50' },
              { label: 'Avg. Rating', value: '4.8 / 5.0', sub: '210 Reviews', icon: BarChart3, color: '#d97706', bg: 'bg-amber-50' },
              { label: 'Retention Rate', value: '68%', sub: 'Returning Clients', icon: PieChart, color: '#059669', bg: 'bg-emerald-50' },
            ].map((insight, i) => (
              <View key={i} className="w-full bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
                <View className="flex-row items-center gap-4 mb-4">
                  <View className={`${insight.bg} w-12 h-12 rounded-[20px] items-center justify-center`}>
                    <insight.icon size={22} color={insight.color} />
                  </View>
                  <View>
                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{insight.label}</Text>
                    <Text className="text-lg font-black text-slate-900 tracking-tight">{insight.value}</Text>
                  </View>
                </View>
                <View className="h-1 bg-slate-50 rounded-full overflow-hidden">
                   <View className={`h-full w-full ${insight.bg.replace('bg-', 'bg-')}`} style={{ opacity: 0.3 }} />
                </View>
                <Text className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">{insight.sub}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
