import React, { useState } from 'react';
import { View, useWindowDimensions, Pressable } from 'react-native';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Slot } from 'expo-router';

export const MainLayout = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <View className="flex-1 bg-slate-50 flex-row overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {!isLargeScreen && sidebarOpen && (
        <Pressable 
          className="absolute inset-0 bg-slate-900/40 z-40" 
          onPress={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {(isLargeScreen || sidebarOpen) && (
        <View 
          className={`${isLargeScreen ? 'relative translate-x-0' : 'absolute left-0 z-50'} h-full bg-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}
        >
          <Sidebar onClose={() => !isLargeScreen && setSidebarOpen(false)} />
        </View>
      )}

      {/* Main Content */}
      <View className="flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    </View>
  );
};
