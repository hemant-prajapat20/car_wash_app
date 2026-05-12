import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import type { RootState } from '../../store';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Clock, 
  Users, 
  Package, 
  DollarSign, 
  Gift, 
  MessageSquare, 
  Bell, 
  Settings,
  LogOut,
  WashingMachine,
  Search,
  CalendarDays
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const role = user?.role || 'customer';

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.replace('/(auth)/login');
  };

  const vendorLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/(vendor)/dashboard' },
    { icon: CalendarRange, label: 'Manage Bookings', path: '/(vendor)/manage-bookings' },
    { icon: Clock, label: 'Slot Management', path: '/(vendor)/slot-management' },
    { icon: Users, label: 'Staff Management', path: '/(vendor)/staff-management' },
    { icon: Package, label: 'Services & Packages', path: '/(vendor)/services-packages' },
    { icon: Users, label: 'Customers', path: '/(vendor)/customers' },
    { icon: DollarSign, label: 'Revenue & Earnings', path: '/(vendor)/revenue' },
    { icon: Gift, label: 'Rewards & Offers', path: '/(vendor)/rewards' },
    { icon: MessageSquare, label: 'Complaints', path: '/(vendor)/complaints' },
    { icon: Bell, label: 'Notifications', path: '/(vendor)/notifications' },
    { icon: Settings, label: 'Settings', path: '/(vendor)/settings' },
  ];

  const customerLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/(customer)/dashboard' },
    { icon: Search, label: 'Search Vendors', path: '/(customer)/search-vendors' },
    { icon: Clock, label: 'Book Service', path: '/(customer)/book-service' },
    { icon: CalendarDays, label: 'My Bookings', path: '/(customer)/bookings' },
    { icon: Bell, label: 'Notifications', path: '/(customer)/notifications' },
    { icon: Settings, label: 'Profile Settings', path: '/(customer)/profile' },
  ];

  const mainLinks = role === 'vendor' ? vendorLinks : customerLinks;

  const renderLink = (link: any) => {
    const isActive = pathname?.startsWith(link.path);
    const Icon = link.icon;
    
    return (
      <Pressable
        key={link.path}
        onPress={() => {
          router.push(link.path as any);
          if (onClose) onClose();
        }}
        className={`flex-row items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
          isActive ? 'bg-primary-50' : 'active:bg-slate-50'
        }`}
      >
        <Icon size={20} color={isActive ? '#0284c7' : '#64748b'} />
        <Text className={`text-sm ${isActive ? 'text-primary-700 font-inter-semibold' : 'text-slate-600 font-inter-medium'}`}>
          {link.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-white border-r border-slate-100">
      {/* Logo */}
      <View className="p-6 border-b border-slate-50 flex-row items-center gap-3">
        <View className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
          <WashingMachine size={24} color="#fff" />
        </View>
        <Text className="font-inter-semibold text-lg text-slate-900 tracking-tight">AquaWash Pro</Text>
      </View>

      {/* Nav Links */}
      <ScrollView className="flex-1 px-4 py-4">
        {mainLinks.map(renderLink)}
      </ScrollView>

      {/* Logout */}
      <View className="p-4 border-t border-slate-100">
        <Pressable 
          onPress={handleLogout}
          className="flex-row items-center gap-3 px-4 py-3 w-full active:bg-red-50 rounded-xl"
        >
          <View className="p-2 rounded-lg bg-slate-50">
            <LogOut size={18} color="#ef4444" />
          </View>
          <Text className="text-slate-600 font-inter-semibold text-sm">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};
