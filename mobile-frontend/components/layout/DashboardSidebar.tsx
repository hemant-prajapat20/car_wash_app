import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  WashingMachine,
  Menu,
  X
} from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  interpolate,
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import { logout } from '../../store/authSlice';
import { type RootState } from '../../store';

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const DashboardSidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen?: boolean, setIsMobileOpen?: (val: boolean) => void }) => {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarWidth = useSharedValue(SIDEBAR_EXPANDED_WIDTH);
  const isWeb = Platform.OS === 'web';
  const { width: windowWidth } = Dimensions.get('window');
  const isMobile = windowWidth < 768;

  useEffect(() => {
    sidebarWidth.value = withSpring(isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH, {
      damping: 15,
      stiffness: 100
    });
  }, [isCollapsed]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/(admin)/dashboard' },
    { id: 'register-vendor', label: 'Register Vendor', icon: UserPlus, path: '/(admin)/register-vendor' },
    { id: 'vendors', label: 'Vendors', icon: Users, path: '/(admin)/vendors' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/(admin)/settings' },
  ];

  const activeRoute = segments[segments.length - 1] || 'dashboard';

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      width: isWeb ? sidebarWidth.value : '100%',
    };
  });

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const NavItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = activeRoute === item.id || (activeRoute === 'admin' && item.id === 'dashboard');
    
    return (
      <Pressable
        onPress={() => {
          router.push(item.path as any);
          if (isMobile && setIsMobileOpen) setIsMobileOpen(false);
        }}
        className={`flex-row items-center h-12 px-4 mx-2 rounded-xl mb-1 transition-all duration-200 ${
          isActive ? 'bg-primary-50' : 'hover:bg-slate-50'
        }`}
      >
        <View className="relative">
          <item.icon 
            size={20} 
            color={isActive ? '#38bdf8' : '#94a3b8'} 
            strokeWidth={isActive ? 2.5 : 2}
          />
          {isActive && (
            <Animated.View 
              className="absolute -left-4 w-1 h-5 bg-primary-500 rounded-r-full"
              entering={FadeIn.duration(300)}
            />
          )}
        </View>
        
        {!isCollapsed && (
          <Text className={`ml-4 font-inter-semibold text-[13px] ${
            isActive ? 'text-primary-600' : 'text-slate-600'
          }`}>
            {item.label}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <Animated.View 
      style={[
        animatedSidebarStyle,
        isWeb ? { height: '100vh', position: 'sticky', top: 0 } : { height: '100%' }
      ]}
      className="bg-white border-r border-slate-100 shadow-xl z-50"
    >
      {/* Header */}
      <View className="h-20 flex-row items-center justify-between px-6 border-b border-slate-50 mb-6">
        <View className="flex-row items-center">
          <View className="w-9 h-9 bg-primary-600 rounded-xl items-center justify-center shadow-lg shadow-primary-900">
            <WashingMachine size={18} color="#fff" />
          </View>
          {!isCollapsed && (
            <View className="ml-3">
              <Text className="text-slate-900 font-inter-bold text-sm tracking-tight">AquaWash</Text>
              <Text className="text-primary-500 text-[10px] font-inter-bold uppercase tracking-widest">Admin</Text>
            </View>
          )}
        </View>
        
        {isWeb && (
          <Pressable 
            onPress={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center border border-slate-100 active:scale-95"
          >
            {isCollapsed ? <ChevronRight size={14} color="#94a3b8" /> : <ChevronLeft size={14} color="#94a3b8" />}
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          {!isCollapsed && <Text className="px-6 text-[10px] font-inter-bold text-slate-600 uppercase tracking-[2px] mb-4">Main Menu</Text>}
          {menuItems.map(item => <NavItem key={item.id} item={item} />)}
        </View>
      </ScrollView>

      {/* Profile & Footer */}
      <View className="p-4 border-t border-slate-50 bg-slate-50/30">
        {!isCollapsed ? (
          <View className="bg-white border border-slate-100 p-3 rounded-2xl mb-4 flex-row items-center shadow-sm">
            <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100 relative">
              <Text className="text-slate-900 font-inter-bold text-sm">AD</Text>
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-slate-900 font-inter-bold text-[12px]" numberOfLines={1}>Super Admin</Text>
              <Text className="text-slate-500 text-[10px]" numberOfLines={1}>{user?.email || 'admin@aquawash.saas'}</Text>
            </View>
          </View>
        ) : (
          <View className="items-center mb-4">
             <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
              <Text className="text-slate-900 font-inter-bold text-sm">AD</Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={handleLogout}
          className={`flex-row items-center h-12 px-4 mx-2 rounded-xl transition-all duration-200 hover:bg-red-500/10 group`}
        >
          <LogOut size={20} color="#ef4444" />
          {!isCollapsed && (
            <Text className="ml-4 font-inter-semibold text-[13px] text-red-500">
              Sign Out
            </Text>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
};
