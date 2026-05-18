import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { 
  MapPin, Star, Clock, Info, ChevronRight, CheckCircle2, 
  ShieldCheck, ArrowLeft, Mail, Phone, Menu 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';
import { HeaderNotificationIcon } from '../../../components/HeaderNotificationIcon';

export default function MobileVendorProfile() {
  const { vendorId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorDetails = async () => {
    try {
      const response = await api.get(`/customer/vendors/${vendorId}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch vendor details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchVendorDetails();
  }, [vendorId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendorDetails();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</Text>
      </View>
    );
  }

  if (!data?.vendor) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-xl font-bold text-slate-900">Vendor Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600 font-bold">Back to Search</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { vendor, services, slots, reviews } = data;
  const startingPrice = services.length > 0 ? Math.min(...services.map((s: any) => s.price)) : 499;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
          >
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">{vendor.companyName}</Text>
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Verified Professional Partner</Text>
          </View>
        </View>
        <HeaderNotificationIcon role="customer" />
      </View>

      <ScrollView 
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6">
          {/* Hero Header Card */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm mb-6">
            <View className="flex-row items-center gap-5 mb-6">
              <View className="w-24 h-24 bg-slate-50 rounded-[30px] border-4 border-white shadow-lg overflow-hidden shrink-0">
                {vendor.avatar ? (
                  <Image source={{ uri: vendor.avatar }} className="w-full h-full object-cover" />
                ) : (
                  <View className="w-full h-full flex items-center justify-center bg-blue-50">
                    <Text className="text-blue-600 text-3xl font-black">{vendor.companyName?.charAt(0) || 'V'}</Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Text className="text-xl font-black text-slate-900 tracking-tighter" numberOfLines={1}>{vendor.companyName}</Text>
                  <ShieldCheck size={18} color="#10b981" />
                </View>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vendor.fullName}</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3 mb-6">
              <View className="bg-slate-50 px-3 py-2 rounded-2xl flex-row items-center gap-2 border border-slate-100">
                <MapPin size={12} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-600" numberOfLines={1}>{vendor.businessLocation}</Text>
              </View>
              <View className="bg-amber-50 px-3 py-2 rounded-2xl flex-row items-center gap-2 border border-amber-100">
                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-[10px] font-black text-amber-700">4.8 Rating</Text>
              </View>
              <View className="bg-blue-50 px-3 py-2 rounded-2xl flex-row items-center gap-2 border border-blue-100">
                <Clock size={12} color="#2563eb" />
                <Text className="text-[10px] font-black text-blue-700">{slots.length} Slots</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => router.push(`/(customer)/book?vendor=${vendor._id}` as any)}
              className="w-full py-5 bg-blue-600 rounded-[24px] flex-row items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Text className="text-white text-xs font-black uppercase tracking-widest">Book Appointment</Text>
              <ChevronRight size={18} color="white" />
            </TouchableOpacity>
            <Text className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">
              Packages from ₹{startingPrice}
            </Text>
          </View>

          {/* Services Section */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm mb-6">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-sm font-black text-slate-900 uppercase tracking-tight">Service Packages</Text>
              <View className="bg-slate-50 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-black text-slate-500 uppercase">{services.length}</Text>
              </View>
            </View>

            {services.length === 0 ? (
              <Text className="text-slate-400 font-bold italic text-xs text-center py-4">No services listed.</Text>
            ) : (
              <View className="gap-5">
                {services.map((service: any) => (
                  <View key={service._id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 pr-4">
                        <Text className="text-[15px] font-black text-slate-900" numberOfLines={1}>{service.name}</Text>
                        <View className="bg-blue-600 px-2 py-0.5 rounded mt-2 self-start">
                          <Text className="text-[8px] font-black text-white uppercase tracking-widest">{service.category}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-xl font-black text-emerald-600">₹{service.price}</Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <Clock size={10} color="#94a3b8" />
                          <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{service.duration} Min</Text>
                        </View>
                      </View>
                    </View>
                    <Text className="text-xs font-medium text-slate-500 leading-5 mb-4">{service.description}</Text>
                    
                    {service.features && service.features.length > 0 && (
                      <View className="pt-4 border-t border-white flex-row flex-wrap gap-x-4 gap-y-2">
                        {service.features.map((f: string, i: number) => (
                          <View key={i} className="flex-row items-center gap-1.5">
                            <CheckCircle2 size={12} color="#10b981" />
                            <Text className="text-[10px] font-bold text-slate-600">{f}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Contact & Reviews */}
          <View className="gap-6">
            <View className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contact Channels</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <View className="w-10 h-10 bg-white items-center justify-center rounded-xl shadow-sm">
                    <Mail size={16} color="#94a3b8" />
                  </View>
                  <Text className="text-xs font-bold text-slate-600 flex-1" numberOfLines={1}>{vendor.email}</Text>
                </View>
                <View className="flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <View className="w-10 h-10 bg-white items-center justify-center rounded-xl shadow-sm">
                    <Phone size={16} color="#94a3b8" />
                  </View>
                  <Text className="text-xs font-bold text-slate-600 flex-1">{vendor.phone}</Text>
                </View>
              </View>
            </View>

            <View className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm mb-10">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Feedback</Text>
                <View className="bg-slate-50 px-2 py-0.5 rounded-lg">
                  <Text className="text-[9px] font-black text-slate-500">{reviews.length}</Text>
                </View>
              </View>
              
              {reviews.length === 0 ? (
                <Text className="text-slate-400 font-bold italic text-[11px] text-center py-4">No reviews yet.</Text>
              ) : (
                <View className="gap-5">
                  {reviews.map((r: any) => (
                    <View key={r._id} className="pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-xs font-black text-slate-900">{r.customer?.fullName || 'Customer'}</Text>
                        <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          <Star size={10} color="#f59e0b" fill="#f59e0b" />
                          <Text className="text-[10px] font-black text-amber-700">{r.rating}</Text>
                        </View>
                      </View>
                      <Text className="text-xs font-medium text-slate-500 leading-5">{r.comment}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
