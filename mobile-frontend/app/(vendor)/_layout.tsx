import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { router } from 'expo-router';
import { 
  LayoutDashboard, Inbox, Clock, Package, 
  Users, Contact, Receipt, BarChart3, 
  Bell, User, LogOut 
} from 'lucide-react-native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

function CustomDrawerContent(props: any) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}
        >
          <LogOut size={22} color="#f43f5e" />
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#f43f5e' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function VendorLayout() {
  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <HeaderNotificationIcon role="vendor" />,
        drawerActiveBackgroundColor: '#eff6ff',
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: { fontWeight: 'bold' }
      }}
    >
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
