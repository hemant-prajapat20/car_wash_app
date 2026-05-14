import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Search, MapPin, Star, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import api from '../../services/api';
import { useRouter } from 'expo-router';

export default function VendorSearch() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/search', {
        params: { city, service: search }
      });
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
  }, [city]);

  const renderVendor = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(customer)/vendor/${item._id}`)}
      className="bg-white mx-6 mb-4 rounded-[32px] border border-slate-100 overflow-hidden shadow-sm"
    >
      <View className="h-40 bg-slate-100">
         <Image 
            source={{ uri: `https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000` }}
            className="w-full h-full"
         />
         <View className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center gap-1">
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-[10px] font-bold text-slate-900">4.8</Text>
         </View>
      </View>
      
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-slate-900 leading-tight">{item.companyName || item.fullName}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MapPin size={12} color="#64748b" />
              <Text className="text-slate-500 text-xs font-medium">{item.businessLocation || 'Main Street Center'}</Text>
            </View>
          </View>
          <View className="bg-blue-50 px-3 py-1.5 rounded-xl">
             <Text className="text-blue-600 text-[10px] font-bold uppercase">Open</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
           {(item.services || []).slice(0, 3).map((s: any, i: number) => (
              <View key={i} className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                 <Text className="text-slate-500 text-[10px] font-bold uppercase">{s.name}</Text>
              </View>
           ))}
        </View>

        <View className="mt-5 pt-4 border-t border-slate-50 flex-row justify-between items-center">
           <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pricing starts from ₹299</Text>
           <ChevronRight size={18} color="#0f172a" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 pb-6 px-6 shadow-sm shadow-slate-100">
        <Text className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Find Services</Text>
        
        <View className="flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 h-12">
            <Search size={18} color="#94a3b8" />
            <TextInput 
              placeholder="Search services..."
              className="flex-1 ml-3 text-sm font-medium text-slate-900"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={fetchVendors}
            />
          </View>
          <TouchableOpacity className="w-12 h-12 bg-slate-900 items-center justify-center rounded-2xl shadow-lg shadow-slate-200">
             <SlidersHorizontal size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row gap-2 mt-4">
           {['All', 'Delhi', 'Mumbai', 'Bangalore', 'Pune'].map((c) => (
             <TouchableOpacity 
                key={c}
                onPress={() => setCity(c === 'All' ? '' : c)}
                className={`px-5 py-2 rounded-xl border ${city === (c === 'All' ? '' : c) ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100' : 'bg-white border-slate-100'}`}
             >
                <Text className={`text-[10px] font-bold uppercase tracking-widest ${city === (c === 'All' ? '' : c) ? 'text-white' : 'text-slate-400'}`}>{c}</Text>
             </TouchableOpacity>
           ))}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
           <ActivityIndicator color="#2563eb" />
           <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">Searching Vendors...</Text>
        </View>
      ) : (
        <FlatList 
          data={vendors}
          renderItem={renderVendor}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
               <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                  <Search size={32} color="#94a3b8" />
               </View>
               <Text className="text-slate-900 font-bold text-lg">No Vendors Found</Text>
               <Text className="text-slate-400 text-sm mt-1">Try adjusting your search filters.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
