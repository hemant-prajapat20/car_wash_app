import React from 'react';
import { PanelLayout } from '../../components/layout/PanelLayout';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Clock, 
  Users, 
  Package, 
  Users2, 
  DollarSign, 
  Gift, 
  FileText, 
  Receipt,
  Bell,
  Settings
} from 'lucide-react-native';

export default function VendorLayout() {
  const vendorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/vendor/dashboard' },
    { id: 'manage-bookings', label: 'Manage Bookings', icon: CalendarRange, path: '/vendor/manage-bookings' },
    { id: 'slot-management', label: 'Slot Handling', icon: Clock, path: '/vendor/slot-management' },
    { id: 'staff-management', label: 'Staff Records', icon: Users, path: '/vendor/staff-management' },
    { id: 'services-packages', label: 'Service Catalog', icon: Package, path: '/vendor/services-packages' },
    { id: 'customers', label: 'My Customers', icon: Users2, path: '/vendor/customers' },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign, path: '/vendor/revenue' },
    { id: 'rewards', label: 'Partner Rewards', icon: Gift, path: '/vendor/rewards' },
    { id: 'gst', label: 'Tax & GST', icon: Receipt, path: '/vendor/gst' },
    { id: 'report', label: 'Reports', icon: FileText, path: '/vendor/report' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/vendor/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/vendor/settings' },
  ];

  return (
    <PanelLayout 
      menuItems={vendorMenuItems} 
      basePath="/vendor" 
      roleLabel="Vendor" 
    />
  );
}
