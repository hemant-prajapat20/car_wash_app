import React from 'react';
import { View, Platform, ScrollView, Text, Pressable } from 'react-native';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu, Bell, Search } from 'lucide-react-native';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <View className="flex-1 bg-slate-50 flex-row">
      {/* Sidebar - Persistent on Web, Toggleable on Mobile */}
      {Platform.OS === 'web' && <DashboardSidebar />}

      <View className="flex-1 h-full">
        {/* Header */}
        <View className="bg-white h-16 border-b border-slate-200 flex-row items-center justify-between px-6">
          <View className="flex-row items-center gap-4">
            {Platform.OS !== 'web' && (
              <Pressable className="p-2 bg-slate-100 rounded-lg">
                <Menu size={20} color="#64748b" />
              </Pressable>
            )}
            <Text className="font-inter-bold text-lg text-slate-800">{title}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="hidden md:flex flex-row items-center bg-slate-100 px-3 py-2 rounded-xl gap-2 w-64">
              <Search size={16} color="#94a3b8" />
              <Text className="text-slate-400 font-inter-medium text-[12px]">Search anything...</Text>
            </View>
            <Pressable className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 relative">
              <Bell size={20} color="#64748b" />
              <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Pressable>
          </View>
        </View>

        {/* Content Area */}
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
};
