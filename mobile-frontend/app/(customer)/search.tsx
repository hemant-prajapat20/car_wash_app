import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Search, MapPin, Star, ChevronRight, Waves } from 'lucide-react-native';
import api from '../../services/api';
import { useRouter } from 'expo-router';

export default function VendorSearch() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/search');
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((v: any) => 
    (v.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.businessLocation || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderVendor = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(customer)/book?vendor=${item._id}`)}
      className="bg-white mx-6 mb-4 rounded-[32px] border border-slate-100 overflow-hidden shadow-sm"
    >
      <View className="h-40 bg-slate-50 items-center justify-center">
         <Waves size={40} color="#cbd5e1" />
         <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center gap-1 shadow-sm">
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-[10px] font-bold text-slate-700">4.8</Text>
         </View>
      </View>
      
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-slate-900 leading-tight truncate">{item.companyName || item.fullName}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MapPin size={12} color="#94a3b8" />
              <Text className="text-slate-500 text-xs font-medium truncate">{item.businessLocation || 'Location not specified'}</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 pt-4 border-t border-slate-50 flex-row justify-between items-center">
           <View className="flex-row -space-x-2">
              {[1,2,3].map(i => (
                <View key={i} className="w-6 h-6 rounded-full border-[1.5px] border-white bg-slate-200" />
              ))}
              <View className="w-6 h-6 rounded-full border-[1.5px] border-white bg-blue-50 flex items-center justify-center">
                 <Text className="text-[7px] font-bold text-blue-600">+12</Text>
              </View>
           </View>
           <View className="p-2 bg-slate-50 rounded-xl">
             <ChevronRight size={16} color="#94a3b8" />
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-slate-50 pt-4 pb-6 px-6">
        <Text className="text-[16px] font-bold text-slate-900 tracking-tight">Explore Centers</Text>
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">Discover top-rated car wash vendors</Text>
        
        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
          <Search size={18} color="#94a3b8" />
          <TextInput 
            placeholder="Search city or center..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 text-xs font-medium text-slate-900"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
           <ActivityIndicator color="#2563eb" />
           <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">Loading Vendors...</Text>
        </View>
      ) : (
        <FlatList 
          data={filteredVendors}
          renderItem={renderVendor}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
               <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                  <Search size={32} color="#94a3b8" />
               </View>
               <Text className="text-slate-900 font-bold text-lg">No Vendors Found</Text>
               <Text className="text-slate-400 text-sm mt-1">Try a different search term.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
