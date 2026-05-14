import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { 
  ShoppingBag, Users, TrendingUp, Clock, 
  CheckCircle2, AlertCircle, Crown, UserCheck 
} from 'lucide-react-native';
import api from '../../services/api';

export default function VendorDashboard() {
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
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Analyzing Performance...</Text>
      </View>
    );
  }

  const statCards = [
    { label: 'Revenue', val: `₹${stats?.revenue || 0}`, icon: <TrendingUp size={16} color="#059669" />, bg: 'bg-emerald-50' },
    { label: 'Orders', val: stats?.totalBookings || 0, icon: <ShoppingBag size={16} color="#2563eb" />, bg: 'bg-blue-50' },
    { label: 'Completed', val: stats?.completedBookings || 0, icon: <CheckCircle2 size={16} color="#4f46e5" />, bg: 'bg-indigo-50' },
    { label: 'Staff', val: stats?.totalWorkers || 0, icon: <Users size={16} color="#9333ea" />, bg: 'bg-purple-50' },
    { label: 'Popular Slot', val: stats?.popularSlot || 'N/A', icon: <Clock size={16} color="#ea580c" />, bg: 'bg-orange-50' },
    { label: 'Pending', val: stats?.pendingBookings || 0, icon: <AlertCircle size={16} color="#d97706" />, bg: 'bg-amber-50' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-900 tracking-tight">Overview</Text>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time intelligence</Text>
        </View>
        <View className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex-row items-center gap-2">
          <View className="w-2 h-2 bg-emerald-500 rounded-full" />
          <Text className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Live</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="px-6 py-6">
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {statCards.map((stat, i) => (
            <View key={i} className="w-[48%] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center gap-2 mb-3">
                <View className={`${stat.bg} p-2 rounded-xl`}>
                  {stat.icon}
                </View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-1" numberOfLines={1}>{stat.label}</Text>
              </View>
              <Text className="text-lg font-bold text-slate-900" numberOfLines={1}>{stat.val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-6 mb-6">
        <View className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <Text className="text-base font-bold text-slate-900 mb-1">Recent Activity</Text>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Latest service fulfillment</Text>
          
          {recentBookings.length > 0 ? (
            recentBookings.map((bk, i) => (
              <View key={i} className={`flex-row items-center justify-between py-4 ${i !== recentBookings.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
                    <UserCheck size={18} color="#64748b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{bk.customer?.fullName || 'Walk-in'}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" numberOfLines={1}>{bk.service?.name}</Text>
                      <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">• {bk.slot?.time}</Text>
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-slate-900 mb-1">₹{bk.totalAmount}</Text>
                  <View className={`px-2 py-1 rounded-md ${bk.status === 'Completed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <Text className={`text-[8px] font-bold uppercase tracking-widest ${bk.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {bk.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-6">
              <AlertCircle size={24} color="#cbd5e1" className="mb-2" />
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Recent Bookings</Text>
            </View>
          )}
        </View>
      </View>

      {/* Top Customers */}
      <View className="px-6 mb-10">
        <View className="bg-slate-900 rounded-[32px] p-6 shadow-xl">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="w-10 h-10 bg-amber-400/10 rounded-xl items-center justify-center">
              <Crown size={20} color="#fbbf24" />
            </View>
            <View>
              <Text className="text-white font-bold text-base">Top Customers</Text>
              <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">High-Value Leaders</Text>
            </View>
          </View>

          {topCustomers.length > 0 ? (
            topCustomers.map((customer, i) => (
              <View key={i} className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-white/10 rounded-lg items-center justify-center">
                    <Text className="text-slate-300 font-bold text-xs">{i + 1}</Text>
                  </View>
                  <View>
                    <Text className="text-white font-bold text-sm">{customer.customerDetails?.fullName}</Text>
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{customer.bookingsCount} Visits</Text>
                  </View>
                </View>
                <Text className="text-amber-400 font-bold text-sm">₹{customer.totalSpent}</Text>
              </View>
            ))
          ) : (
            <View className="items-center py-4">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Initializing Leaderboard...</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
