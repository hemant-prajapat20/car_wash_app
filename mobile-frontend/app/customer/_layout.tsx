import React from 'react';
import { PanelLayout } from '../../components/layout/PanelLayout';
import { 
  LayoutDashboard, 
  Search, 
  Store, 
  PlusCircle, 
  Calendar, 
  History, 
  Bell, 
  Tag, 
  Trophy, 
  User, 
  Settings
} from 'lucide-react-native';

export default function CustomerLayout() {
  const customerMenuItems = [
    { id: 'dashboard', label: 'My Home', icon: LayoutDashboard, path: '/customer/dashboard' },
    { id: 'search-vendors', label: 'Find Car Wash', icon: Search, path: '/customer/search-vendors' },
    { id: 'bookings', label: 'Active Bookings', icon: Calendar, path: '/customer/bookings' },
    { id: 'booking-history', label: 'Past Services', icon: History, path: '/customer/booking-history' },
    { id: 'notifications', label: 'Updates', icon: Bell, path: '/customer/notifications' },
    { id: 'offers', label: 'Promo Deals', icon: Tag, path: '/customer/offers' },
    { id: 'rewards', label: 'Loyalty Points', icon: Trophy, path: '/customer/rewards' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/customer/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/customer/settings' },
  ];

  return (
    <PanelLayout 
      menuItems={customerMenuItems} 
      basePath="/customer" 
      roleLabel="Customer" 
    />
  );
}
