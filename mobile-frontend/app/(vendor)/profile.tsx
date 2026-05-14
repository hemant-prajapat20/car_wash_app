import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LogOut } from 'lucide-react-native';

export default function VendorProfile() {
  const dispatch = useDispatch();

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <Text className="text-xl font-bold text-slate-900 mb-8">Vendor Profile</Text>
      
      <TouchableOpacity 
        onPress={() => dispatch(logout())}
        className="w-full flex-row items-center justify-center gap-3 bg-red-50 py-4 rounded-[20px] border border-red-100"
      >
        <LogOut size={18} color="#ef4444" />
        <Text className="text-red-500 font-bold text-sm">Sign Out Session</Text>
      </TouchableOpacity>
    </View>
  );
}
