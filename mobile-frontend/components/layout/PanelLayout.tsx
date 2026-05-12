import React, { useState } from 'react';
import { View, Platform, Pressable, Text, Dimensions } from 'react-native';
import { AppSidebar } from './AppSidebar';
import { Menu, X, Bell, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

interface PanelLayoutProps {
  menuItems: any[];
  basePath: string;
  roleLabel: string;
}

export const PanelLayout = ({ menuItems, basePath, roleLabel }: PanelLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isWeb = Platform.OS === 'web';
  const { width: windowWidth } = Dimensions.get('window');
  const isMobile = windowWidth < 768;

  const TopHeader = () => (
    <View className="h-16 bg-white border-b border-slate-100 px-6 flex-row items-center justify-between z-40">
      <View className="flex-row items-center">
        {isMobile && (
          <Pressable 
            onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-4 p-2 bg-slate-900 rounded-lg border border-slate-800"
          >
            {isMobileMenuOpen ? <X size={20} color="#0f172a" /> : <Menu size={20} color="#0f172a" />}
          </Pressable>
        )}
        <View className="relative hidden md:flex">
          <View className="absolute left-3 top-[10px] z-10">
            <Search size={16} color="#475569" />
          </View>
          <View className="bg-slate-50 border border-slate-100 rounded-full w-64 px-10 py-2">
            <Text className="text-slate-400 text-xs font-inter-medium">Search records...</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <Pressable className="p-2 bg-slate-50 rounded-full border border-slate-100 relative">
          <Bell size={18} color="#64748b" />
          <View className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
        </Pressable>
        <View className="h-8 w-[1px] bg-slate-100 mx-2 hidden md:flex" />
        <View className="hidden md:flex items-end">
          <Text className="text-slate-900 font-inter-bold text-[11px]">{roleLabel} Portal</Text>
          <Text className="text-emerald-500 text-[9px] font-inter-bold uppercase tracking-widest">Active Session</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 flex-row">
        {!isMobile && (
          <AppSidebar 
            menuItems={menuItems} 
            basePath={basePath} 
            roleLabel={roleLabel} 
          />
        )}

        {isMobile && isMobileMenuOpen && (
          <View className="absolute inset-0 z-[100] flex-row">
            <View className="w-64 h-full">
              <AppSidebar 
                menuItems={menuItems} 
                basePath={basePath} 
                roleLabel={roleLabel} 
                isMobileOpen={isMobileMenuOpen} 
                setIsMobileOpen={setIsMobileMenuOpen}
              />
            </View>
            <Pressable 
              className="flex-1 bg-black/60" 
              onPress={() => setIsMobileMenuOpen(false)} 
            />
          </View>
        )}

        <View className="flex-1 flex-col overflow-hidden">
          <TopHeader />
          <SafeAreaView className="flex-1" edges={['bottom']}>
            <Stack screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'white' },
              animation: 'fade'
            }} />
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};
