import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Play, Zap, Check } from 'lucide-react-native';
import { Button } from '../ui/Button';

export const Hero = () => {
  const router = useRouter();

  return (
    <View className="bg-white border-b border-slate-50">
      <View className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20">
        <View className="flex-col lg:flex-row items-center lg:items-start gap-10 md:gap-16">
          
          {/* Left Content */}
          <View className="w-full lg:flex-1 space-y-6 md:space-y-8">
            <View className="flex-row items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full self-start">
              <Zap size={12} color="#0284c7" fill="#0284c7" />
              <Text className="text-primary-700 text-[11px] font-inter-bold uppercase tracking-widest">Next Generation Platform</Text>
            </View>
            
            <Text className="text-4xl md:text-6xl font-inter-bold text-slate-900 tracking-tight leading-tight">
              Smart <Text className="text-primary-600">Operations</Text> for Professional Business
            </Text>
            
            <Text className="text-base md:text-lg text-slate-500 font-inter-medium leading-relaxed max-w-xl">
              Manage bookings, staff, and revenue with an all-in-one professional SaaS platform. Engineered for scale, security, and simplicity.
            </Text>

            <View className="flex-row flex-wrap gap-x-8 gap-y-3">
              {['No hidden fees', 'Free 14-day trial'].map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <View className="w-5 h-5 bg-green-50 rounded-full items-center justify-center">
                    <Check size={12} color="#16a34a" strokeWidth={3} />
                  </View>
                  <Text className="text-[13px] font-inter-semibold text-slate-600">{item}</Text>
                </View>
              ))}
            </View>

            <View style={{ zIndex: 10 }} className="flex-row gap-4 pt-4">
              <Button size="md" className="px-8 py-4 rounded-2xl shadow-xl" onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-white text-sm font-inter-bold">Get Started</Text>
                <ChevronRight color="#fff" size={16} />
              </Button>
              <Button variant="outline" size="md" className="px-8 py-4 rounded-2xl" onPress={() => router.push('/(auth)/login')}>
                <Text className="text-slate-700 text-sm font-inter-bold">View Demo</Text>
              </Button>
            </View>
          </View>

          {/* Right Content */}
          <View className="w-full lg:flex-1 mt-12 lg:mt-0">
             <View className="rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" }} 
                  className="w-full aspect-[16/10]"
                  resizeMode="cover"
                />
             </View>
          </View>

        </View>
      </View>
    </View>
  );
};
