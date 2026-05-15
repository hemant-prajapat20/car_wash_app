import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { router } from 'expo-router';
import { 
  Home, Search, CalendarCheck, History, User, LogOut, Bell 
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

export default function CustomerLayout() {
  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <HeaderNotificationIcon role="customer" />,
        drawerActiveBackgroundColor: '#eff6ff',
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: { fontWeight: 'bold' }
      }}
    >
      <Drawer.Screen 
        name="search" 
        options={{ title: 'Search Vendors', drawerIcon: ({ color }) => <Search size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="book" 
        options={{ title: 'Book Service', drawerIcon: ({ color }) => <CalendarCheck size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="bookings" 
        options={{ title: 'My Bookings', drawerIcon: ({ color }) => <History size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="notifications" 
        options={{ title: 'Notifications', drawerIcon: ({ color }) => <Bell size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="profile" 
        options={{ title: 'Profile Settings', drawerIcon: ({ color }) => <User size={22} color={color} /> }} 
      />
    </Drawer>
  );
}
