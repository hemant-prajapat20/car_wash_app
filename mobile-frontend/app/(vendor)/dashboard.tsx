import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, ActivityIndicator, 
  RefreshControl, TouchableOpacity, Dimensions 
} from 'react-native';
import { 
  ShoppingBag, Users, TrendingUp, Clock, 
  CheckCircle2, AlertCircle, Crown, UserCheck,
  ChevronRight, BarChart3, Star, Menu
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

const { width } = Dimensions.get('window');

export default function VendorDashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/vendor/dashboard');
      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentBookings(response.data.data.recentBookings || []);
        setTopCustomers(response.data.data.topCustomers || []);
      }
    } catch (err) {
      console.error('Error fetching vendor dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <View className="relative">
          <ActivityIndicator size="large" color="#2563eb" />
          <View className="absolute inset-0 items-center justify-center">
             <BarChart3 size={12} color="#2563eb" />
          </View>
        </View>
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Analyzing Performance...</Text>
      </View>
    );
  }

  const statCards = [
    { label: 'Revenue', val: `₹${stats?.revenue || 0}`, icon: <TrendingUp size={16} color="#059669" />, bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Orders', val: stats?.totalBookings || 0, icon: <ShoppingBag size={16} color="#2563eb" />, bg: 'bg-blue-50', trend: '+5%' },
    { label: 'Completed', val: stats?.completedBookings || 0, icon: <CheckCircle2 size={16} color="#4f46e5" />, bg: 'bg-indigo-50', trend: '98%' },
    { label: 'Staff', val: stats?.totalWorkers || 0, icon: <Users size={16} color="#9333ea" />, bg: 'bg-purple-50', trend: 'Active' },
    { label: 'Popular Slot', val: stats?.popularSlot || 'N/A', icon: <Clock size={16} color="#ea580c" />, bg: 'bg-orange-50', trend: 'Prime' },
    { label: 'Pending', val: stats?.pendingBookings || 0, icon: <AlertCircle size={16} color="#d97706" />, bg: 'bg-amber-50', trend: 'Action' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Custom Premium Header */}
        <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
            >
              <Menu size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Performance</Text>
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Business Intelligence</Text>
            </View>
          </View>
          <HeaderNotificationIcon role="vendor" />
        </View>

        {/* Stats Grid */}
        <View className="px-6 py-6">
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {statCards.map((stat, i) => (
              <TouchableOpacity 
                key={i} 
                activeOpacity={0.7}
                className="w-[48.5%] bg-white border border-slate-100 rounded-3xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className={`${stat.bg} p-2 rounded-2xl`}>
                    {stat.icon}
                  </View>
                  <View className="bg-emerald-50 px-1.5 py-0.5 rounded-lg">
                    <Text className="text-[8px] font-black text-emerald-600">{stat.trend}</Text>
                  </View>
                </View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" numberOfLines={1}>{stat.label}</Text>
                <Text className="text-xl font-black text-slate-900" numberOfLines={1}>{stat.val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity Table View */}
        <View className="px-6 mb-6">
          <View className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Latest service fulfillment</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(vendor)/bookings')}>
                <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl">View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentBookings.length > 0 ? (
              recentBookings.map((bk, i) => (
                <TouchableOpacity 
                  key={i} 
                  activeOpacity={0.6}
                  className={`flex-row items-center justify-between py-4 ${i !== recentBookings.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-10 h-10 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100">
                      <UserCheck size={18} color="#2563eb" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{bk.customer?.fullName || 'Walk-in Customer'}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" numberOfLines={1}>{bk.service?.name}</Text>
                        <View className="w-1 h-1 bg-slate-200 rounded-full" />
                        <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{bk.slot?.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end ml-2">
                    <Text className="text-sm font-bold text-slate-900 mb-1">₹{bk.totalAmount}</Text>
                    <View className={`px-2 py-0.5 rounded-lg ${bk.status === 'Completed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                      <Text className={`text-[8px] font-bold uppercase tracking-widest ${bk.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {bk.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-100">
                <AlertCircle size={24} color="#cbd5e1" className="mb-2" />
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Recent Activity</Text>
              </View>
            )}
          </View>
        </View>

        {/* Top Customers Leaderboard */}
        <View className="px-6 mb-10">
          <View className="bg-slate-900 rounded-[40px] p-6 shadow-xl shadow-slate-200 overflow-hidden">
            <View className="flex-row items-center gap-4 mb-8">
              <View className="w-12 h-12 bg-amber-400/10 rounded-2xl items-center justify-center">
                <Crown size={24} color="#fbbf24" />
              </View>
              <View>
                <Text className="text-white font-black text-lg tracking-tight">Top Customers</Text>
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">High-Value Leaders</Text>
              </View>
            </View>

            <View className="space-y-4">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer, i) => (
                  <View key={i} className="flex-row items-center justify-between py-2">
                    <View className="flex-row items-center gap-4">
                      <View className="w-8 h-8 bg-white/10 rounded-xl items-center justify-center">
                        <Text className="text-slate-400 font-bold text-xs">{i + 1}</Text>
                      </View>
                      <View>
                        <Text className="text-white font-bold text-sm" numberOfLines={1}>{customer.customerDetails?.fullName}</Text>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{customer.bookingsCount} Visits</Text>
                      </View>
                    </View>
                    <View className="bg-amber-400/10 px-3 py-1 rounded-xl">
                      <Text className="text-amber-400 font-bold text-sm">₹{customer.totalSpent}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center py-6 opacity-30">
                  <Star size={32} color="#475569" />
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No Leaders Yet</Text>
                </View>
              )}
            </View>

            <View className="mt-8 pt-6 border-t border-white/10 flex-row items-center justify-between">
              <View>
                <Text className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Monthly Growth</Text>
                <Text className="text-emerald-400 font-black text-xl">+24.5%</Text>
              </View>
              <View className="w-10 h-10 bg-emerald-500/10 rounded-2xl items-center justify-center">
                 <TrendingUp size={20} color="#10b981" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
