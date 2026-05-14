import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { Button } from '../../components/ui/Button';
import { LogOut, User, MapPin, Search } from 'lucide-react-native';

export default function CustomerHome() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white pt-16 pb-6 px-6 border-b border-slate-100 shadow-sm shadow-slate-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Location</Text>
            <View className="flex-row items-center gap-1">
              <MapPin size={14} color="#2563eb" />
              <Text className="text-slate-900 text-sm font-bold">Mumbai, Maharashtra</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-slate-100 rounded-2xl items-center justify-center">
            <User size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <Search size={18} color="#94a3b8" />
          <Text className="text-slate-400 text-sm font-medium">Search for car wash centers...</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <Text className="text-xl font-bold text-slate-900 tracking-tight mb-4">Welcome, {user?.fullName || 'Guest'}</Text>
        
        <View className="bg-blue-600 p-6 rounded-3xl mb-6 shadow-xl shadow-blue-100">
          <Text className="text-white text-lg font-bold mb-1">Get 20% Off</Text>
          <Text className="text-blue-100 text-xs font-medium mb-4">On your first deep cleaning service</Text>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-xl self-start">
            <Text className="text-blue-600 text-xs font-bold uppercase tracking-widest">Book Now</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white p-10 rounded-3xl border border-slate-100 items-center justify-center">
          <Text className="text-slate-400 text-sm font-medium italic">Mobile app content coming soon...</Text>
        </View>

        <Button 
          title="Logout Account"
          onPress={() => dispatch(logout())}
          variant="outline"
          className="mt-10"
        />
      </ScrollView>
    </View>
  );
}
