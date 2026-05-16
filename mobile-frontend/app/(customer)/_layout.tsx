import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { router } from 'expo-router';
import { 
  Home, Search, CalendarCheck, History, User, LogOut, Bell, Waves
} from 'lucide-react-native';

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
            <Text className="text-xl font-black text-slate-900 tracking-tighter">Chakachak</Text>
            <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Premium Car Care</Text>
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

export default function CustomerLayout() {
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
        name="search" 
        options={{ title: 'Search Vendors', drawerIcon: ({ color }) => <Search size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="book" 
        options={{ 
          title: 'Book Service', 
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="c-bookings" 
        options={{ title: 'My Bookings', drawerIcon: ({ color }) => <History size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="c-notifications" 
        options={{ 
          title: 'Notifications', 
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="c-profile" 
        options={{ title: 'Profile Settings', drawerIcon: ({ color }) => <User size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="vendor/[vendorId]" 
        options={{ 
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }} 
      />
    </Drawer>
  );
}
