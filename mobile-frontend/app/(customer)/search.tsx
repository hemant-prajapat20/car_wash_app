import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Search, MapPin, Star, ChevronRight, Waves, Menu, Clock, ShieldCheck, Briefcase } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function VendorSearch() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  const fetchVendors = async () => {
    try {
      const response = await api.get('/customer/search');
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const filteredVendors = vendors.filter((v: any) => 
    (v.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.businessLocation || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.activeServices && v.activeServices.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
  );

  const renderVendor = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(customer)/vendor/${item._id}` as any)}
      activeOpacity={0.8}
      className="bg-white mx-6 mb-6 rounded-[32px] border border-slate-100 overflow-hidden shadow-sm"
    >
      <View className="p-5">
        {/* Header: Avatar & Info */}
        <View className="flex-row items-start gap-4 mb-5">
          <View className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} className="w-full h-full object-cover" />
            ) : (
              <Waves size={24} color="#2563eb" />
            )}
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[15px] font-black text-slate-900 tracking-tight pr-2 flex-1" numberOfLines={1}>
                {item.companyName}
              </Text>
              <View className="bg-amber-50 px-2 py-1 rounded-lg flex-row items-center gap-1 border border-amber-100">
                <Star size={10} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-[10px] font-black text-amber-700">4.8</Text>
              </View>
            </View>
            <Text className="text-xs font-bold text-slate-500 mb-1">{item.fullName}</Text>
            <View className="flex-row items-center gap-1">
              <MapPin size={10} color="#94a3b8" />
              <Text className="text-[10px] font-bold text-slate-400 truncate" numberOfLines={1}>
                {item.businessLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View className="flex-row gap-2 mb-5">
          <View className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting At</Text>
            <Text className="text-sm font-black text-emerald-600">₹{item.startingPrice || 499}</Text>
          </View>
          <View className="flex-1 bg-blue-50 rounded-xl p-3 border border-blue-100">
            <Text className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">Availability</Text>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#2563eb" />
              <Text className="text-sm font-black text-blue-600">{item.availableSlotsCount || 0} Slots</Text>
            </View>
          </View>
        </View>

        {/* Services */}
        <View className="mb-6">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available Services</Text>
          <View className="flex-row flex-wrap gap-2">
            {item.activeServices && item.activeServices.length > 0 ? (
              item.activeServices.slice(0, 3).map((srv: string, idx: number) => (
                <View key={idx} className="bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Text className="text-[9px] font-bold text-slate-600">{srv}</Text>
                </View>
              ))
            ) : (
              <Text className="text-[10px] text-slate-400 italic font-medium">Standard wash packages available</Text>
            )}
            {item.activeServices && item.activeServices.length > 3 && (
              <Text className="text-[10px] font-bold text-slate-400 ml-1">+{item.activeServices.length - 3} more</Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View className="pt-4 border-t border-slate-50 flex-row items-center justify-between">
          <View className="bg-emerald-50 px-2.5 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-emerald-100">
            <ShieldCheck size={12} color="#10b981" />
            <Text className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Book Now</Text>
            <View className="w-10 h-10 bg-slate-900 rounded-2xl items-center justify-center shadow-lg shadow-slate-200">
              <ChevronRight size={18} color="white" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-white pt-4 pb-6 px-6 shadow-sm shadow-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
          >
            <Menu size={22} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">Explore Centers</Text>
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Discover Top-Rated Professionals</Text>
          </View>
        </View>
        <HeaderNotificationIcon role="customer" />
      </View>

      <View className="bg-slate-50 flex-1">
        <View className="px-6 pt-6 pb-2">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-3xl px-4 h-14 shadow-sm mb-6">
            <Search size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Search by city, center or service..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-xs font-bold text-slate-900"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
             <ActivityIndicator color="#2563eb" size="large" />
             <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Locating Professionals...</Text>
          </View>
        ) : (
          <FlatList 
            data={filteredVendors}
            renderItem={renderVendor}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20 px-10">
                 <View className="w-24 h-24 bg-white rounded-[40px] items-center justify-center mb-6 shadow-sm">
                    <Search size={40} color="#cbd5e1" />
                 </View>
                 <Text className="text-slate-900 font-black text-xl text-center">No Vendors Found</Text>
                 <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2 text-center leading-4">
                    Try adjusting your search filters or searching a different city
                 </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
