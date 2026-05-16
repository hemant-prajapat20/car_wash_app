import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, Image, Alert
} from 'react-native';
import { 
  Users, Search, MoreVertical, Star, User, 
  Phone, Mail, History, X, Trash2, Menu
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function VendorCustomers() {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/vendor/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to remove this customer from your directory? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              setCustomers(prev => prev.filter(c => c._id !== id));
              setSelectedCustomer(null);
              Alert.alert('Success', 'Customer removed successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete customer');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Directory...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-slate-50" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
            >
              <Menu size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Client Directory</Text>
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Client Management</Text>
            </View>
          </View>
          <HeaderNotificationIcon role="vendor" />
        </View>

        <View className="px-6 pt-6">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-12 mb-6 shadow-sm">
            <Search size={16} color="#94a3b8" />
            <TextInput 
              placeholder="Search clients..." 
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-xs font-semibold text-slate-900"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {filteredCustomers.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
              <Users size={48} color="#cbd5e1" className="mb-4" />
              <Text className="text-slate-900 font-bold text-base mb-1">No customers found</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                Try adjusting your search query
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between pb-10">
              {filteredCustomers.map((cust) => (
                <TouchableOpacity 
                  key={cust._id} 
                  onPress={() => setSelectedCustomer(cust)}
                  activeOpacity={0.7}
                  className="w-[48%] bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm mb-4"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center overflow-hidden border border-slate-50">
                      {cust.avatar ? (
                        <Image source={{ uri: cust.avatar }} className="w-full h-full" />
                      ) : (
                        <Users size={18} color="#2563eb" />
                      )}
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(cust._id)}>
                       <Trash2 size={16} color="#fda4af" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-sm font-bold text-slate-900 leading-tight mb-1" numberOfLines={1}>{cust.name}</Text>
                  <Text className="text-[10px] font-semibold text-slate-400 mb-4" numberOfLines={1}>{cust.email}</Text>

                  <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
                    <View>
                      <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bookings</Text>
                      <Text className="text-xs font-bold text-slate-900 mt-0.5">{cust.bookingsCount}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-1 rounded-md h-fit">
                      <Star size={10} color="#f59e0b" fill="#f59e0b" />
                      <Text className="text-[10px] font-bold text-amber-700">{cust.avgRating ? cust.avgRating.toFixed(1) : '5.0'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Customer Profile Modal */}
      <Modal
        visible={!!selectedCustomer}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCustomer(null)}
      >
        <View className="flex-1 bg-slate-900/40 justify-end">
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setSelectedCustomer(null)}
            className="flex-1"
          />
          <View className="bg-white rounded-t-[40px] px-8 pb-10 shadow-2xl">
            <View className="w-12 h-1.5 bg-slate-100 rounded-full self-center mt-4 mb-8" />
            
            <View className="items-center -mt-20 mb-6">
              <View className="w-24 h-24 bg-white rounded-[32px] p-1.5 shadow-xl">
                <View className="w-full h-full bg-slate-50 rounded-[28px] overflow-hidden items-center justify-center">
                  {selectedCustomer?.avatar ? (
                    <Image source={{ uri: selectedCustomer.avatar }} className="w-full h-full" />
                  ) : (
                    <User size={40} color="#cbd5e1" />
                  )}
                </View>
              </View>
            </View>

            <View className="items-center mb-8">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-bold text-slate-900">{selectedCustomer?.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(selectedCustomer._id)}>
                   <Trash2 size={18} color="#e11d48" />
                </TouchableOpacity>
              </View>
              <Text className="text-slate-500 font-medium mt-1">{selectedCustomer?.email}</Text>
            </View>

            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-slate-50 p-4 rounded-2xl">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bookings</Text>
                <Text className="text-lg font-black text-slate-900">{selectedCustomer?.bookingsCount}</Text>
              </View>
              <View className="flex-1 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <Text className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 text-center">Avg Rating</Text>
                <View className="flex-row items-center justify-center gap-1">
                  <Text className="text-lg font-black text-amber-700">{selectedCustomer?.avgRating ? selectedCustomer.avgRating.toFixed(1) : '5.0'}</Text>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                </View>
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                <View className="w-10 h-10 bg-blue-50 items-center justify-center rounded-xl">
                  <Phone size={18} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</Text>
                  <Text className="text-sm font-bold text-slate-700">{selectedCustomer?.phone || 'Not Provided'}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                <View className="w-10 h-10 bg-emerald-50 items-center justify-center rounded-xl">
                  <History size={18} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer ID</Text>
                  <Text className="text-sm font-bold text-slate-700" numberOfLines={1}>#{selectedCustomer?._id?.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setSelectedCustomer(null)}
              className="w-full mt-10 py-4 bg-slate-900 rounded-2xl items-center shadow-lg"
            >
              <Text className="text-white font-bold text-sm uppercase tracking-widest">Close Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
