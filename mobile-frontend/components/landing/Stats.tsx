import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Users, CheckCircle2, DollarSign, Briefcase, Heart, Globe, Clock, ShieldCheck } from 'lucide-react-native';

const stats = [
  { label: 'Bookings', value: '45k+', icon: CheckCircle2, color: '#2563eb', bg: 'bg-blue-50' },
  { label: 'Vendors', value: '1,200+', icon: Briefcase, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Users', value: '150k+', icon: Users, color: '#4f46e5', bg: 'bg-indigo-50' },
  { label: 'Revenue', value: '$8.4M', icon: DollarSign, color: '#d97706', bg: 'bg-amber-50' },
  { label: 'Success', value: '99.9%', icon: TrendingUp, color: '#e11d48', bg: 'bg-rose-50' },
  { label: 'Rating', value: '4.95', icon: Heart, color: '#9333ea', bg: 'bg-purple-50' },
  { label: 'Cities', value: '250+', icon: Globe, color: '#0ea5e9', bg: 'bg-sky-50' },
  { label: 'Time Saved', value: '85k hr', icon: Clock, color: '#84cc16', bg: 'bg-lime-50' },
  { label: 'Security', value: 'Enterprise', icon: ShieldCheck, color: '#64748b', bg: 'bg-slate-100' },
];

export const Stats = () => {
  return (
    <View id="stats" className="py-12 md:py-24 bg-slate-900 px-4 md:px-8 border-y border-slate-800/50">
      <View className="max-w-7xl mx-auto">
        <View className="mb-8 md:mb-16 items-center md:items-start space-y-3">
          <View>
            <Text className="text-primary-400 font-inter-semibold text-[9px] md:text-[10px] uppercase tracking-[0.25em] mb-1.5 text-center md:text-left">Live Ecosystem Metrics</Text>
            <Text className="text-2xl md:text-5xl font-inter-semibold text-white tracking-tighter text-center md:text-left">
              Platform Performance
            </Text>
          </View>
          <Text className="text-slate-400 text-xs md:text-base font-inter-medium max-w-2xl leading-relaxed text-center md:text-left">
            We track every drop of data to ensure your business runs like a well-oiled machine.
          </Text>
        </View>

        <View className="flex-row flex-wrap -m-1.5 md:-m-3">
          {stats.map((item, idx) => (
            <View key={idx} className="w-1/2 md:w-1/3 lg:w-1/3 p-1.5 md:p-3">
              <View className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 flex-col md:flex-row items-center md:items-center gap-3 md:gap-5 shadow-xl shadow-black/20">
                <View className={`w-10 h-10 md:w-14 md:h-14 ${item.bg} rounded-xl md:rounded-2xl items-center justify-center shadow-inner`}>
                  <item.icon size={20} color={item.color} className="md:w-6 md:h-6" />
                </View>
                <View className="items-center md:items-start w-full">
                  <Text 
                    numberOfLines={1} 
                    className="text-lg md:text-3xl font-inter-semibold text-white tracking-tight"
                  >
                    {item.value}
                  </Text>
                  <Text className="text-[8px] md:text-xs text-slate-500 font-inter-semibold uppercase tracking-widest text-center md:text-left">
                    {item.label}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
