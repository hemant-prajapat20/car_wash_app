import React from 'react';
import { View, Text } from 'react-native';
import {
  CalendarCheck,
  Clock,
  LayoutDashboard,
  Users2,
  BarChart3,
  Gift,
  BellRing,
  Building2,
  ChevronRight
} from 'lucide-react-native';
import { Card } from '../ui/Card';

const features = [
  { title: 'Smart Booking', desc: 'Instant scheduling for any vehicle.', icon: CalendarCheck, color: 'bg-blue-50', iconColor: '#2563eb' },
  { title: 'Live Slots', desc: 'Real-time bay tracking.', icon: Clock, color: 'bg-emerald-50', iconColor: '#059669' },
  { title: 'Vendor Hub', desc: 'Business control center.', icon: LayoutDashboard, color: 'bg-indigo-50', iconColor: '#4f46e5' },
  { title: 'Staff Sync', desc: 'Shift & task management.', icon: Users2, color: 'bg-amber-50', iconColor: '#d97706' },
  { title: 'Revenue Pro', desc: 'Earnings & growth analytics.', icon: BarChart3, color: 'bg-rose-50', iconColor: '#e11d48' },
  { title: 'Loyalty Club', desc: 'Rewarding customers.', icon: Gift, color: 'bg-purple-50', iconColor: '#9333ea' },
  { title: 'Insta-Alerts', desc: 'SMS & push notifications.', icon: BellRing, color: 'bg-sky-50', iconColor: '#0ea5e9' },
  { title: 'Network+', desc: 'Scale locations easily.', icon: Building2, color: 'bg-slate-50', iconColor: '#475569' }
];

export const Features = () => {
  return (
    <View id="features" className="py-12 md:py-20 bg-slate-50 px-4 md:px-8 border-b border-slate-100">
      <View className="max-w-7xl mx-auto">
        <View className="mb-8 md:mb-12 items-center md:items-start">
          <Text className="text-primary-600 font-inter-semibold text-[10px] uppercase tracking-widest mb-2">Our Features</Text>
          <Text className="text-3xl font-inter-bold text-slate-900">Engineered for Success</Text>
        </View>

        <View className="flex-row flex-wrap -m-2 md:-m-3">
          {features.map((feature, idx) => (
            <View key={idx} className="w-1/2 lg:w-1/4 p-2 md:p-3">
              <Card className="p-5 border-none shadow-sm h-full hover:shadow-md transition-all">
                <View className={`w-9 h-9 ${feature.color} rounded-xl items-center justify-center mb-3`}>
                  <feature.icon size={18} color={feature.iconColor} />
                </View>
                <Text className="text-base font-inter-bold text-slate-900 mb-1">{feature.title}</Text>
                <Text className="text-xs text-slate-500 font-inter-medium leading-relaxed mb-3">{feature.desc}</Text>
                <View className="flex-row items-center gap-1 mt-auto">
                  <Text className="text-primary-600 text-[10px] font-inter-bold uppercase">Explore</Text><ChevronRight size={10} color="#0284c7" />
                </View>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
