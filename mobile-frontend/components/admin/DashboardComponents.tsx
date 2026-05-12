import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, trendPositive, color = '#3b82f6' }: StatCardProps) => {
  return (
    <View className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex-1 min-w-[150px] m-1">
      <View className="flex-row justify-between items-start mb-3">
        <View 
          className="p-2 rounded-xl" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={18} color={color} />
        </View>
        {trend && (
          <View className={`px-1.5 py-0.5 rounded-full ${trendPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            <Text className={`text-[10px] font-inter-semibold ${trendPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-slate-500 text-[11px] font-inter-medium uppercase tracking-wider mb-1">{title}</Text>
      <Text className="text-slate-900 text-xl font-inter-bold tracking-tight">{value}</Text>
    </View>
  );
};

export const DashboardCard = ({ children, title, subtitle, className = '' }: { children: React.ReactNode, title?: string, subtitle?: string, className?: string }) => {
  return (
    <View className={`bg-white border border-slate-100 rounded-2xl overflow-hidden ${className} shadow-sm`}>
      {(title || subtitle) && (
        <View className="px-5 py-4 border-b border-slate-800/50 flex-row justify-between items-center">
          <View>
            {title && <Text className="text-slate-900 font-inter-bold text-sm tracking-tight">{title}</Text>}
            {subtitle && <Text className="text-slate-500 text-[10px] font-inter-medium mt-0.5">{subtitle}</Text>}
          </View>
        </View>
      )}
      <View className="p-5">
        {children}
      </View>
    </View>
  );
};
