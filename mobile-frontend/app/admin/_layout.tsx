import React from 'react';
import { PanelLayout } from '../../components/layout/PanelLayout';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Settings, 
  Shield, 
  Server,
  BarChart3
} from 'lucide-react-native';

export default function AdminLayout() {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'register-vendor', label: 'Register Vendor', icon: UserPlus, path: '/admin/register-vendor' },
    { id: 'vendors', label: 'Vendors', icon: Users, path: '/admin/vendors' },
    { id: 'statistics', label: 'Statistics', icon: BarChart3, path: '/admin/statistics' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/admin/revenue' },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, path: '/admin/complaints' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    { id: 'platform-settings', label: 'Platform Config', icon: Server, path: '/admin/platform-settings' },
    { id: 'security', label: 'Security', icon: Shield, path: '/admin/security' },
  ];

  return (
    <PanelLayout 
      menuItems={adminMenuItems} 
      basePath="/admin" 
      roleLabel="SuperAdmin" 
    />
  );
}
