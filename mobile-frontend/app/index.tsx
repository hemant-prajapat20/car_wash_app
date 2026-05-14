import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Zap, BarChart3, Users, ChevronRight, CheckCircle2, Star, Menu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* NAVBAR */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-50">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-slate-900 rounded-xl items-center justify-center">
            <ShieldCheck color="white" size={18} />
          </View>
          <Text className="text-xl font-bold text-slate-900 tracking-tighter">Chakachak</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center bg-slate-50 rounded-xl">
          <Menu size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View className="px-6 pt-12 pb-20 items-center">
          <View className="bg-blue-50 px-4 py-1.5 rounded-full mb-6">
            <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Premium SaaS Solutions</Text>
          </View>
          <Text className="text-4xl font-bold text-center text-slate-900 leading-[44px] tracking-tight">
            The Future of Car{'\n'}Wash Management
          </Text>
          <Text className="text-slate-500 text-center text-base mt-4 leading-6 px-4">
            Streamline your operations, boost revenue, and delight customers with the world's most advanced car wash platform.
          </Text>
          
          <View className="flex-row gap-4 mt-10 w-full">
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/signup')}
              className="flex-1 bg-slate-900 h-14 rounded-2xl items-center justify-center shadow-xl shadow-slate-200"
            >
              <Text className="text-white font-bold">Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              className="flex-1 bg-white border border-slate-200 h-14 rounded-2xl items-center justify-center"
            >
              <Text className="text-slate-900 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-12 w-full h-48 bg-slate-100 rounded-[40px] items-center justify-center overflow-hidden border border-slate-200">
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000' }}
                className="w-full h-full opacity-80"
                resizeMode="cover"
             />
             <View className="absolute bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex-row items-center gap-3">
                <CheckCircle2 color="#10b981" size={20} />
                <Text className="text-slate-900 font-bold text-sm">Real-time Tracking Active</Text>
             </View>
          </View>
        </View>

        {/* STATS SECTION */}
        <View className="bg-slate-900 py-16 px-6">
           <View className="flex-row flex-wrap justify-between">
              <View className="w-[45%] mb-8">
                 <Text className="text-white text-3xl font-bold">500+</Text>
                 <Text className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Active Vendors</Text>
              </View>
              <View className="w-[45%] mb-8">
                 <Text className="text-white text-3xl font-bold">50k+</Text>
                 <Text className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Happy Users</Text>
              </View>
              <View className="w-[45%]">
                 <Text className="text-white text-3xl font-bold">4.9/5</Text>
                 <Text className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">App Rating</Text>
              </View>
              <View className="w-[45%]">
                 <Text className="text-white text-3xl font-bold">1M+</Text>
                 <Text className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Cars Washed</Text>
              </View>
           </View>
        </View>

        {/* FEATURES SECTION */}
        <View className="px-6 py-20">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[4px] mb-2 text-center">Core Features</Text>
          <Text className="text-3xl font-bold text-slate-900 text-center tracking-tight mb-12">Engineered for Excellence</Text>
          
          <View className="gap-6">
            {[
              { icon: <Zap color="#2563eb" size={24} />, title: "Lightning Fast Booking", desc: "Book a slot in under 30 seconds with our optimized workflow." },
              { icon: <Users color="#2563eb" size={24} />, title: "Staff Management", desc: "Assign workers and track productivity in real-time." },
              { icon: <BarChart3 color="#2563eb" size={24} />, title: "Advanced Analytics", desc: "Deep insights into your revenue and customer behavior." }
            ].map((f, i) => (
              <View key={i} className="flex-row gap-5 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm shadow-slate-200">{f.icon}</View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-lg">{f.title}</Text>
                  <Text className="text-slate-500 text-sm mt-1 leading-5">{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* SOLUTIONS SECTION */}
        <View className="bg-blue-600 py-20 px-8 rounded-t-[50px]">
           <Text className="text-white text-3xl font-bold tracking-tight mb-4">Ready to scale your{'\n'}business?</Text>
           <Text className="text-blue-100 text-base leading-6 mb-10">
              Join thousands of vendors who have transformed their traditional wash centers into high-tech SaaS businesses.
           </Text>
           <TouchableOpacity className="bg-white h-14 rounded-2xl items-center justify-center px-8 self-start">
              <Text className="text-blue-600 font-bold">View Solutions</Text>
           </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View className="bg-white px-6 py-12 items-center">
           <View className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center mb-4">
              <ShieldCheck color="white" size={22} />
           </View>
           <Text className="text-slate-900 font-bold text-lg mb-1">Chakachak SaaS</Text>
           <Text className="text-slate-400 text-xs mb-8">© 2024 All rights reserved.</Text>
           
           <View className="flex-row gap-6 mb-10">
              {['About', 'Privacy', 'Terms', 'Support'].map(t => (
                 <TouchableOpacity key={t}>
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t}</Text>
                 </TouchableOpacity>
              ))}
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
