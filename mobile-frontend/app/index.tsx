import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ShieldCheck, Zap, BarChart3, Users, Clock, 
  CreditCard, Bell, Star, UserCheck, TrendingUp,
  CheckCircle2, Globe, LayoutDashboard, Calendar, ArrowRight, Menu, X,
  ShoppingBag, Store, Heart, RefreshCw, AppWindow, MessageCircle, Share2, Link, Mail, Phone, MapPin
} from 'lucide-react-native';

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* NAVBAR */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between border-b border-slate-50 bg-white z-20">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center shadow-sm">
            <Text className="text-white font-bold">C</Text>
          </View>
          <Text className="text-xl font-bold text-slate-900 tracking-tight">Chakachak</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 items-center justify-center bg-slate-50 rounded-xl"
        >
          {isMenuOpen ? <X size={20} color="#0f172a" /> : <Menu size={20} color="#0f172a" />}
        </TouchableOpacity>
      </View>

      {/* INVISIBLE OVERLAY TO CLOSE MENU WHEN TAPPING OUTSIDE */}
      {isMenuOpen && (
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setIsMenuOpen(false)} 
          className="absolute top-[88px] bottom-0 left-0 right-0 z-20 bg-black/5"
        />
      )}

      {/* MOBILE DROP-DOWN MENU OVERLAY */}
      {isMenuOpen && (
        <View className="absolute top-[88px] left-0 right-0 bg-white border-b border-slate-100 p-6 z-30 shadow-xl shadow-slate-200/50">
          <View className="gap-2 mb-6">
            {['Home', 'Features', 'Solutions', 'Statistics', 'About'].map((item, i) => (
              <TouchableOpacity key={i} onPress={() => setIsMenuOpen(false)} className="py-3 px-4 rounded-xl bg-slate-50">
                <Text className="text-slate-600 font-semibold">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={() => { setIsMenuOpen(false); router.push('/(auth)/login'); }}
              className="flex-1 py-3 items-center border border-slate-200 rounded-xl"
            >
              <Text className="text-slate-600 font-semibold">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => { setIsMenuOpen(false); router.push('/(auth)/signup'); }}
              className="flex-1 py-3 items-center bg-blue-600 rounded-xl shadow-sm shadow-blue-200"
            >
              <Text className="text-white font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        {/* HERO SECTION */}
        <View className="px-6 pt-12 pb-16 items-center">
          <View className="bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full flex-row items-center gap-2 mb-6">
            <Zap size={12} color="#2563eb" fill="#2563eb" />
            <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Next-Gen SaaS Platform</Text>
          </View>
          
          <Text className="text-4xl font-bold text-center text-slate-900 leading-[48px] tracking-tight mb-5">
            Scale Your Car Wash{'\n'}
            <Text className="text-blue-600">Operations Automatically.</Text>
          </Text>
          
          <Text className="text-slate-500 text-center text-base leading-relaxed px-2 mb-8">
            The intelligent operating system for modern car wash businesses. Manage bookings, staff, and revenue growth in one centralized dashboard.
          </Text>
          
          <View className="w-full gap-3 mb-10">
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/signup')}
              className="w-full bg-blue-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-blue-200 flex-row gap-2"
            >
              <Text className="text-white font-bold text-sm">Get Started Free</Text>
              <ArrowRight size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              className="w-full bg-slate-50 border border-slate-200 h-14 rounded-xl items-center justify-center"
            >
              <Text className="text-slate-900 font-bold text-sm">Access Portal</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center gap-6 opacity-50 mb-10">
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={16} color="#0f172a" />
              <Text className="font-bold text-[10px] text-slate-900 uppercase tracking-widest">ISO Certified</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <LayoutDashboard size={16} color="#0f172a" />
              <Text className="font-bold text-[10px] text-slate-900 uppercase tracking-widest">99% Uptime</Text>
            </View>
          </View>
        </View>

        {/* FEATURES SECTION (9 Features) */}
        <View className="bg-slate-50 py-16 px-6 border-y border-slate-100">
          <View className="items-center mb-10">
            <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Core Platform</Text>
            <Text className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Engineered for Excellence</Text>
            <View className="w-12 h-1 bg-blue-600 rounded-full" />
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {[
              { icon: Calendar, title: 'Smart Bookings', desc: 'Automated slot management with real-time sync.' },
              { icon: Users, title: 'Vendor Portal', desc: 'Powerful tools to manage shops and staff.' },
              { icon: Clock, title: 'Real-time Slots', desc: 'Live status and booking in seconds.' },
              { icon: CreditCard, title: 'Subscriptions', desc: 'Flexible recurring revenue models.' },
              { icon: Bell, title: 'Notifications', desc: 'Instant SMS and Email alerts.' },
              { icon: BarChart3, title: 'Rich Analytics', desc: 'Data-driven insights for operations.' },
              { icon: Star, title: 'Rewards System', desc: 'Integrated loyalty programs.' },
              { icon: UserCheck, title: 'Customer Tracking', desc: 'Complete history and preferences.' },
              { icon: TrendingUp, title: 'Revenue Insights', desc: 'Track your growth with reporting.' }
            ].map(({ icon: Icon, title, desc }, i) => (
              <View key={i} className="w-[48%] bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm mb-4">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-3">
                  <Icon size={18} color="#2563eb" />
                </View>
                <Text className="text-sm font-bold text-slate-900 mb-1 leading-tight">{title}</Text>
                <Text className="text-[11px] font-medium text-slate-500 leading-relaxed">{desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* SOLUTIONS SECTION */}
        <View className="py-16 px-6 bg-white">
          <View className="items-center mb-10">
            <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">How It Works</Text>
            <Text className="text-3xl font-bold text-slate-900 mb-4 tracking-tight text-center">Solving Modern Car Wash Challenges</Text>
            <View className="w-12 h-1 bg-blue-600 rounded-full" />
          </View>

          <View className="gap-4">
            {[
              { icon: Clock, problem: 'Long Wait Times', solution: 'Instant booking with real-time slot availability sync.' },
              { icon: ShieldCheck, problem: 'Unverified Shops', solution: 'Strict verification process ensures 100% premium service.' },
              { icon: Zap, problem: 'Manual Management', solution: 'Automated staff scheduling and AI-powered reporting.' },
              { icon: CreditCard, problem: 'Payment Friction', solution: 'Secure digital payments and flexible subscription models.' }
            ].map(({ icon: Icon, problem, solution }, i) => (
              <View key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] mb-2">
                <View className="w-10 h-10 bg-white rounded-xl shadow-sm items-center justify-center mb-4">
                  <Icon size={20} color="#2563eb" />
                </View>
                <Text className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">The Problem</Text>
                <Text className="text-lg font-bold text-slate-900 mb-4">{problem}</Text>
                
                <View className="pt-4 border-t border-slate-200">
                  <Text className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Our Solution</Text>
                  <Text className="text-[13px] font-medium text-slate-500 leading-relaxed">{solution}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* STATISTICS SECTION */}
        <View className="py-16 px-6 bg-blue-50/50 border-y border-blue-100/50">
          <View className="items-center mb-10">
            <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Platform Performance</Text>
            <Text className="text-2xl font-bold text-slate-900 mb-3 tracking-tight text-center">Real-time Global Operations</Text>
            <Text className="text-slate-500 text-xs font-medium text-center leading-relaxed">
              Our intelligent ecosystem processes thousands of data points daily, ensuring seamless coordination between vendors and customers while maintaining 99.9% uptime.
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {[
              { icon: ShoppingBag, value: '50k+', label: 'Total Bookings', color: '#2563eb' },
              { icon: Users, value: '12k+', label: 'Active Users', color: '#059669' },
              { icon: Store, value: '250+', label: 'Active Vendors', color: '#9333ea' },
              { icon: Heart, value: '98%', label: 'Satisfaction', color: '#e11d48' },
              { icon: TrendingUp, value: '+45%', label: 'Revenue Growth', color: '#d97706' },
              { icon: RefreshCw, value: '72%', label: 'Repeat Bookings', color: '#4f46e5' },
              { icon: BarChart3, value: '$250k', label: 'Monthly Rev', color: '#3b82f6' },
              { icon: AppWindow, value: '8.5k', label: 'Engagement', color: '#475569' },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <View key={i} className="w-[48%] bg-white p-4 rounded-2xl border border-blue-100 shadow-sm items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-3">
                  <Icon size={20} color={color} />
                </View>
                <Text className="text-xl font-bold text-slate-900 tracking-tight mb-1">{value}</Text>
                <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ABOUT SECTION */}
        <View className="py-16 px-6 bg-slate-50 border-b border-slate-100">
          <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Our Mission</Text>
          <Text className="text-3xl font-bold text-slate-900 mb-6 leading-[40px] tracking-tight">Empowering the Future{'\n'}of Digital Car Care.</Text>
          <Text className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
            Chakachak is a leading SaaS provider dedicated to transforming the car wash industry. Our platform bridges the gap between premium vendors and busy customers through data-driven scheduling and automated business intelligence.
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
            {[
              { title: 'Scalable SaaS', desc: 'Enterprise-grade architecture.' },
              { title: 'Customer Trust', desc: 'Secure payments & verified shops.' },
              { title: 'Business Goals', desc: 'Optimize revenue & growth.' },
              { title: 'Verified Shops', desc: 'Highest quality standards.' }
            ].map((item, i) => (
              <View key={i} className="w-[48%] flex-row items-start gap-2">
                <CheckCircle2 size={16} color="#10b981" className="mt-0.5" />
                <View className="flex-1">
                  <Text className="text-[11px] font-bold text-slate-900 mb-1">{item.title}</Text>
                  <Text className="text-[9px] font-medium text-slate-400">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            <View className="w-[48%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <Text className="text-2xl font-bold text-blue-600 mb-1">10+</Text>
              <Text className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Years Experience</Text>
            </View>
            <View className="w-[48%] bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 mt-4">
              <Text className="text-2xl font-bold text-white mb-1">500+</Text>
              <Text className="text-blue-100 font-bold text-[9px] uppercase tracking-wider">Active Shops</Text>
            </View>
            <View className="w-[48%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm -mt-4">
              <Text className="text-2xl font-bold text-emerald-600 mb-1">99%</Text>
              <Text className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Service Uptime</Text>
            </View>
            <View className="w-[48%] bg-slate-900 p-5 rounded-2xl shadow-xl">
              <Globe color="#3b82f6" size={20} className="mb-2" />
              <Text className="text-white font-bold text-[9px] uppercase tracking-wider">Global Reach</Text>
            </View>
          </View>
        </View>

        {/* FULL FOOTER */}
        <View className="bg-slate-900 pt-16 pb-8 px-6">
          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
                <Text className="text-white font-bold">C</Text>
              </View>
              <Text className="text-lg font-bold text-white tracking-tight">Chakachak</Text>
            </View>
            <Text className="text-slate-400 font-medium text-xs leading-relaxed mb-6">
              The intelligent operating system for professional car wash services.
            </Text>
            <View className="flex-row items-center gap-4">
              {[MessageCircle, Share2, Link].map((Icon, i) => (
                <View key={i} className="p-2 bg-white/10 rounded-lg">
                  <Icon size={16} color="#cbd5e1" />
                </View>
              ))}
            </View>
          </View>

          <View className="flex-row justify-between mb-10">
            <View className="flex-1 pr-4">
              <Text className="text-white text-[11px] font-bold tracking-widest uppercase mb-4">Platform</Text>
              {['Dashboard', 'Vendor Portal', 'Subscription', 'API Docs'].map((item, i) => (
                <Text key={i} className="text-slate-400 font-medium text-xs mb-3">{item}</Text>
              ))}
            </View>
            <View className="flex-1">
              <Text className="text-white text-[11px] font-bold tracking-widest uppercase mb-4">Company</Text>
              {['About Us', 'Careers', 'Privacy', 'Terms'].map((item, i) => (
                <Text key={i} className="text-slate-400 font-medium text-xs mb-3">{item}</Text>
              ))}
            </View>
          </View>

          <View className="mb-10">
            <Text className="text-white text-[11px] font-bold tracking-widest uppercase mb-4">Contact</Text>
            <View className="space-y-4">
              <View className="flex-row items-center gap-3">
                <Mail size={16} color="#3b82f6" />
                <Text className="text-slate-400 font-medium text-xs">support@aquawash.saas</Text>
              </View>
              <View className="flex-row items-center gap-3 mt-3">
                <Phone size={16} color="#3b82f6" />
                <Text className="text-slate-400 font-medium text-xs">+1 (234) 567-890</Text>
              </View>
              <View className="flex-row items-center gap-3 mt-3">
                <MapPin size={16} color="#3b82f6" />
                <Text className="text-slate-400 font-medium text-xs">Silicon Valley, CA</Text>
              </View>
            </View>
          </View>

          <View className="border-t border-white/10 pt-6">
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] w-full text-center">
              © 2026 Chakachak SaaS. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
