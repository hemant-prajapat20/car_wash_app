import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';

export default function CustomerLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
      }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ 
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={22} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />
        }} 
      />
    </Tabs>
  );
}
