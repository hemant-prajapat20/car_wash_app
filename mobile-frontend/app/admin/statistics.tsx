import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { TrendingUp, Users, DollarSign, Calendar, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react-native';
import { StatCard, DashboardCard } from '../../components/admin/DashboardComponents';
import { LineChart, PieChart, ContributionGraph } from 'react-native-chart-kit';

export default function StatisticsPage() {
  const chartConfig = {
    backgroundGradientFrom: '#0f172a',
    backgroundGradientTo: '#0f172a',
    color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    decimalPlaces: 0,
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth > 768 ? (screenWidth - 340) : screenWidth - 40;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Platform Analytics</Text>
          <Text className="text-slate-500 text-sm font-inter-medium mt-1">Deep dive into platform growth and revenue</Text>
        </View>
        <View className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex-row items-center gap-2">
           <Calendar size={14} color="#94a3b8" />
           <Text className="text-slate-400 text-xs font-inter-bold">Last 30 Days</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap -m-1 mb-8">
        <StatCard title="Total Growth" value="+28.4%" icon={TrendingUp} trend="+4.2%" trendPositive={true} color="#10b981" />
        <StatCard title="Customer Retention" value="94.2%" icon={Users} trend="+1.5%" trendPositive={true} color="#38bdf8" />
        <StatCard title="Avg. Order Value" value="$42.50" icon={DollarSign} trend="-0.8%" trendPositive={false} color="#f59e0b" />
        <StatCard title="System Uptime" value="99.98%" icon={Activity} trend="Stable" trendPositive={true} color="#a855f7" />
      </View>

      <DashboardCard title="Revenue Distribution" subtitle="Earnings breakdown by service category" className="mb-8">
        <PieChart
          data={[
            { name: 'Basic Wash', population: 45, color: '#38bdf8', legendFontColor: '#94a3b8', legendFontSize: 12 },
            { name: 'Premium', population: 28, color: '#a855f7', legendFontColor: '#94a3b8', legendFontSize: 12 },
            { name: 'Eco-Friendly', population: 15, color: '#10b981', legendFontColor: '#94a3b8', legendFontSize: 12 },
            { name: 'Detailing', population: 12, color: '#f59e0b', legendFontColor: '#94a3b8', legendFontSize: 12 },
          ]}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </DashboardCard>

      <DashboardCard title="Booking Activity Heatmap" subtitle="Daily transaction density over the last 3 months" className="mb-8">
        <View className="items-center">
          <ContributionGraph
            values={[
              { date: '2024-05-01', count: 1 }, { date: '2024-05-02', count: 2 },
              { date: '2024-05-03', count: 4 }, { date: '2024-05-04', count: 5 },
              { date: '2024-05-05', count: 2 }, { date: '2024-05-06', count: 3 },
            ]}
            endDate={new Date('2024-05-30')}
            numDays={90}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
          />
        </View>
      </DashboardCard>

      <View className="flex-row flex-wrap -m-3">
        <View className="p-3 w-full lg:w-1/2">
          <DashboardCard title="Top Performing Vendors">
            <View className="space-y-4">
              {[
                { name: 'Aqua Shine Pro', rev: '$12,400', color: '#38bdf8' },
                { name: 'Crystal Clean', rev: '$9,800', color: '#a855f7' },
                { name: 'Eco Wash Elite', rev: '$8,200', color: '#10b981' },
              ].map((v, i) => (
                <View key={i} className="flex-row items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: v.color + '20' }}>
                      <Text className="text-sm font-inter-bold" style={{ color: v.color }}>{i+1}</Text>
                    </View>
                    <Text className="text-white font-inter-semibold text-sm">{v.name}</Text>
                  </View>
                  <Text className="text-slate-200 font-inter-bold text-sm">{v.rev}</Text>
                </View>
              ))}
            </View>
          </DashboardCard>
        </View>
        <View className="p-3 w-full lg:w-1/2">
           <DashboardCard title="Platform Growth Score">
              <View className="items-center py-4">
                 <View className="w-32 h-32 rounded-full border-8 border-primary-500/20 items-center justify-center relative">
                    <View className="absolute inset-0 rounded-full border-8 border-primary-500 border-t-transparent -rotate-45" />
                    <Text className="text-white font-inter-bold text-3xl">84</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-inter-bold mt-1 tracking-widest">Excellent</Text>
                 </View>
                 <Text className="text-slate-400 text-xs text-center mt-6 leading-relaxed">
                    Based on user retention, vendor satisfaction, and revenue consistency metrics.
                 </Text>
              </View>
           </DashboardCard>
        </View>
      </View>
    </ScrollView>
  );
}
