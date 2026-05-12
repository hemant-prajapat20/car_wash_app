import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { 
  Users, 
  Store, 
  DollarSign, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react-native';
import { StatCard, DashboardCard } from '../../components/admin/DashboardComponents';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { adminService } from '../../services/authService';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    totalCustomers: 0,
    platformRevenue: 125400
  });

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 125],
      color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
      strokeWidth: 3
    }]
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth > 768 ? (screenWidth - 300) / 2 : screenWidth - 40;

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}
    >
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Overview</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Real-time platform performance metrics</Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap -m-1 mb-8">
        <StatCard 
          title="Total Vendors" 
          value={stats.totalVendors} 
          icon={Store} 
          trend="+12%" 
          trendPositive={true}
          color="#38bdf8"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          trend="+8%" 
          trendPositive={true}
          color="#a855f7"
        />
        <StatCard 
          title="Platform Revenue" 
          value={`$${stats.platformRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+24%" 
          trendPositive={true}
          color="#10b981"
        />
        <StatCard 
          title="Active Bookings" 
          value="1,284" 
          icon={CalendarCheck} 
          trend="-3%" 
          trendPositive={false}
          color="#f59e0b"
        />
      </View>

      {/* Charts Section */}
      <View className="flex-row flex-wrap -m-3 mb-8">
        <View className="p-3 w-full lg:w-1/2">
          <DashboardCard title="Revenue Growth" subtitle="Platform earnings over the last 6 months">
            <LineChart
              data={revenueData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ marginLeft: -20, marginTop: 10 }}
            />
          </DashboardCard>
        </View>
        <View className="p-3 w-full lg:w-1/2">
          <DashboardCard title="Vendor Activity" subtitle="Service performance by category">
            <BarChart
              data={{
                labels: ['Basic', 'Premium', 'Detail', 'Eco'],
                datasets: [{ data: [50, 40, 75, 30] }]
              }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              style={{ marginLeft: -20, marginTop: 10 }}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </DashboardCard>
        </View>
      </View>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity" subtitle="Latest platform events and registrations">
        <View className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} className="flex-row items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-4 border border-slate-100">
                  <Clock size={18} color="#94a3b8" />
                </View>
                <View>
                  <Text className="text-slate-900 font-inter-semibold text-sm">New Vendor Registered</Text>
                  <Text className="text-slate-500 text-[10px]">Aqua Shine Pro • 2 hours ago</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-emerald-500 text-[10px] font-inter-bold mr-2 uppercase">Verified</Text>
                <ChevronRight size={14} color="#334155" />
              </View>
            </View>
          ))}
        </View>
      </DashboardCard>
    </ScrollView>
  );
}
