import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Search, Filter, MoreVertical, ToggleLeft, ToggleRight, Trash2, Mail, ExternalLink, Shield } from 'lucide-react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';
import { adminService } from '../../services/authService';

export default function VendorsManagement() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await adminService.getVendors();
      if (response.success) {
        setVendors(response.data);
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

  const handleToggleStatus = async (vendorId: string, currentStatus: boolean) => {
    try {
      const response = await adminService.toggleVendorStatus(vendorId);
      if (response.success) {
        setVendors(vendors.map(v => v._id === vendorId ? { ...v, isActive: !currentStatus } : v));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update vendor status.');
    }
  };

  const handleDelete = (vendorId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this vendor? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminService.deleteVendor(vendorId);
              if (response.success) {
                setVendors(vendors.filter(v => v._id !== vendorId));
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete vendor.');
            }
          }
        }
      ]
    );
  };

  const filteredVendors = vendors.filter(v => 
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vendorId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="flex-row justify-between items-end mb-8">
        <View>
          <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Vendors</Text>
          <Text className="text-slate-500 text-sm font-inter-medium mt-1">Manage platform partners and their status</Text>
        </View>
        <View className="bg-primary-600/10 border border-primary-500/20 px-4 py-2 rounded-xl">
          <Text className="text-primary-400 font-inter-bold text-xs">{vendors.length} Total Partners</Text>
        </View>
      </View>

      <View className="flex-row mb-6 gap-4">
        <View className="flex-1 relative">
          <View className="absolute left-4 top-[14px] z-10">
            <Search size={18} color="#475569" />
          </View>
          <TextInput 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-3 text-slate-900 font-inter-medium text-sm"
            placeholder="Search by name, company, or ID..."
            placeholderTextColor="#475569"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl items-center justify-center">
          <Filter size={18} color="#94a3b8" />
        </Pressable>
      </View>

      {loading ? (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator color="#38bdf8" size="large" />
          <Text className="text-slate-500 mt-4 font-inter-medium">Syncing vendor records...</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap -m-3">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <View key={vendor._id} className="p-3 w-full lg:w-1/2 xl:w-1/3">
                <DashboardCard className="border-l-4 border-l-primary-500">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-slate-800 rounded-2xl items-center justify-center border border-slate-700">
                        <Text className="text-white font-inter-bold text-lg">{vendor.companyName?.charAt(0)}</Text>
                      </View>
                      <View className="ml-4">
                        <Text className="text-white font-inter-bold text-base" numberOfLines={1}>{vendor.companyName}</Text>
                        <View className="flex-row items-center mt-1">
                          <Shield size={10} color="#38bdf8" />
                          <Text className="text-primary-500 text-[10px] font-inter-bold ml-1 tracking-widest uppercase">{vendor.vendorId || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${vendor.isActive ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                      <Text className={`text-[9px] font-inter-bold uppercase ${vendor.isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {vendor.isActive ? 'Active' : 'Paused'}
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-2 mb-6">
                    <View className="flex-row items-center gap-3">
                      <Mail size={12} color="#475569" />
                      <Text className="text-slate-400 text-xs">{vendor.email}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <ExternalLink size={12} color="#475569" />
                      <Text className="text-slate-400 text-xs">Representative: {vendor.fullName}</Text>
                    </View>
                  </View>

                  <View className="flex-row border-t border-slate-800/50 pt-4 gap-2">
                    <Pressable 
                      onPress={() => handleToggleStatus(vendor._id, vendor.isActive)}
                      className="flex-1 bg-slate-800 h-10 rounded-xl flex-row items-center justify-center gap-2 active:opacity-70"
                    >
                      {vendor.isActive ? <ToggleRight size={18} color="#38bdf8" /> : <ToggleLeft size={18} color="#94a3b8" />}
                      <Text className="text-slate-200 font-inter-bold text-[11px] uppercase tracking-wider">Status</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => handleDelete(vendor._id)}
                      className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl items-center justify-center active:scale-95"
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                </DashboardCard>
              </View>
            ))
          ) : (
            <View className="w-full py-20 items-center justify-center">
              <Text className="text-slate-500 font-inter-medium">No vendors found matching your criteria.</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
