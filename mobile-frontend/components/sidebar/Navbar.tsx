import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Bell, Search, Menu } from 'lucide-react-native';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const displayName = user?.name || 'John Doe';
  const displayRole = user?.role || 'customer';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View className="h-16 bg-white border-b border-slate-200 flex-row items-center justify-between px-4">
      <View className="flex-row items-center gap-2">
        <Pressable 
          onPress={onMenuClick}
          className="p-2 active:bg-slate-100 rounded-lg"
        >
          <Menu size={22} color="#475569" />
        </Pressable>
        <View className="hidden md:flex flex-row items-center gap-3 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
          <Search size={16} color="#94a3b8" />
          <TextInput 
            placeholder="Search anything..." 
            className="text-sm w-48 text-slate-900"
            placeholderTextColor="#64748b"
          />
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable className="relative p-2 active:bg-slate-100 rounded-full">
          <Bell size={20} color="#475569" />
          <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </Pressable>
        
        <View className="h-8 w-[1px] bg-slate-200 mx-1" />
        
        <Pressable className="flex-row items-center gap-2 p-1.5 active:bg-slate-100 rounded-lg">
          <View className="items-end hidden sm:flex">
            <Text className="text-sm font-inter-semibold text-slate-900">{displayName}</Text>
            <Text className="text-[10px] font-inter-semibold text-primary-600 uppercase tracking-widest">{displayRole}</Text>
          </View>
          <View className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Text className="text-white font-inter-semibold text-xs">{initials}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
