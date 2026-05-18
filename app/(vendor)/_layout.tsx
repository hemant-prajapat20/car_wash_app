import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { router } from 'expo-router';
import { Waves, LayoutDashboard, Inbox, Clock, Package, Users, Contact, Receipt, BarChart3, Bell, User, LogOut } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

function CustomDrawerContent(props: any) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Brand Section - Synced with Web */}
      <SafeAreaView edges={['top']} className="border-b border-slate-50">
        <View className="px-6 py-8 flex-row items-center gap-3">
          <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-200">
             <Waves size={20} color="#ffffff" />
          </View>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">Chakachak Vendor</Text>
            <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Vendor Professional Pro</Text>
          </View>
        </View>
      </SafeAreaView>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View className="p-6 border-t border-slate-50">
        <TouchableOpacity 
          onPress={handleLogout}
          activeOpacity={0.7}
          className="flex-row items-center gap-3 bg-rose-50 px-5 py-4 rounded-[20px]"
        >
          <LogOut size={18} color="#e11d48" />
          <Text className="text-xs font-black text-rose-600 uppercase tracking-widest">Logout</Text>
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
        headerShown: false,
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
