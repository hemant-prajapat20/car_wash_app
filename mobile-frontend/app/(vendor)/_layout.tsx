import { Drawer } from 'expo-router/drawer';
import { 
  LayoutDashboard, Inbox, Clock, Package, 
  Users, Contact, Receipt, BarChart3, 
  Bell, User 
} from 'lucide-react-native';

export default function VendorLayout() {
  return (
    <Drawer screenOptions={{ 
      headerShown: true,
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#0f172a',
      headerTitleStyle: { fontWeight: 'bold' },
      drawerActiveBackgroundColor: '#eff6ff',
      drawerActiveTintColor: '#2563eb',
      drawerInactiveTintColor: '#64748b',
      drawerLabelStyle: { fontWeight: 'bold' }
    }}>
      <Drawer.Screen 
        name="dashboard" 
        options={{ title: 'Dashboard', drawerIcon: ({ color }) => <LayoutDashboard size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="bookings" 
        options={{ title: 'Manage Bookings', drawerIcon: ({ color }) => <Inbox size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="slots" 
        options={{ title: 'Slot Management', drawerIcon: ({ color }) => <Clock size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="services" 
        options={{ title: 'Services & Packages', drawerIcon: ({ color }) => <Package size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="workers" 
        options={{ title: 'Manage Workers', drawerIcon: ({ color }) => <Contact size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="customers" 
        options={{ title: 'Customers', drawerIcon: ({ color }) => <Users size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="transactions" 
        options={{ title: 'Transactions', drawerIcon: ({ color }) => <Receipt size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="reports" 
        options={{ title: 'Reports', drawerIcon: ({ color }) => <BarChart3 size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="notifications" 
        options={{ title: 'Notifications', drawerIcon: ({ color }) => <Bell size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="profile" 
        options={{ title: 'Vendor Profile', drawerIcon: ({ color }) => <User size={22} color={color} /> }} 
      />
    </Drawer>
  );
}
