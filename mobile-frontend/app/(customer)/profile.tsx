import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { User, Shield, CreditCard, Bell, LogOut, ChevronRight, Settings } from 'lucide-react-native';

export default function CustomerProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [
    { icon: <User size={20} color="#0f172a" />, title: 'Personal Information', subtitle: 'Manage your profile details' },
    { icon: <CreditCard size={20} color="#0f172a" />, title: 'Payment Methods', subtitle: 'Saved cards and UPI IDs' },
    { icon: <Bell size={20} color="#0f172a" />, title: 'Notifications', subtitle: 'Alerts and booking updates' },
    { icon: <Shield size={20} color="#0f172a" />, title: 'Privacy & Security', subtitle: 'Password and data control' },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View className="bg-slate-900 pt-16 pb-12 px-6 rounded-b-[50px]">
        <View className="flex-row items-center justify-between mb-8">
           <Text className="text-white text-2xl font-bold tracking-tight">Account</Text>
           <TouchableOpacity className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center">
              <Settings size={20} color="white" />
           </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-5">
           <View className="w-20 h-20 bg-blue-500 rounded-[32px] items-center justify-center border-4 border-white/10">
              <Text className="text-white text-2xl font-bold">{user?.fullName?.charAt(0) || 'U'}</Text>
           </View>
           <View>
              <Text className="text-white text-xl font-bold">{user?.fullName || 'Valued Customer'}</Text>
              <Text className="text-blue-200 text-sm font-medium">{user?.email || 'customer@chakachak.com'}</Text>
           </View>
        </View>
      </View>

      <View className="px-6 -mt-6">
         <View className="bg-white rounded-[32px] p-2 shadow-xl shadow-slate-200">
            {menuItems.map((item, index) => (
               <TouchableOpacity 
                  key={index}
                  className={`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? 'border-b border-slate-50' : ''}`}
               >
                  <View className="flex-row items-center gap-4">
                     <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
                        {item.icon}
                     </View>
                     <View>
                        <Text className="text-slate-900 font-bold text-sm">{item.title}</Text>
                        <Text className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">{item.subtitle}</Text>
                     </View>
                  </View>
                  <ChevronRight size={18} color="#cbd5e1" />
               </TouchableOpacity>
            ))}
         </View>
      </View>

      <View className="px-6 py-10">
         <TouchableOpacity 
            onPress={() => dispatch(logout())}
            className="flex-row items-center justify-center gap-3 bg-red-50 py-4 rounded-[20px] border border-red-100"
         >
            <LogOut size={18} color="#ef4444" />
            <Text className="text-red-500 font-bold text-sm">Sign Out Session</Text>
         </TouchableOpacity>
         <Text className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-[3px] mt-8">Chakachak Mobile v1.0.4</Text>
      </View>
    </ScrollView>
  );
}
