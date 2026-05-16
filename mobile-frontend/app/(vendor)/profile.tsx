import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MapPin, Edit2, CheckCircle2, Globe, Mail, Phone, ShieldCheck, Settings, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function VendorProfile() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/vendor/profile');
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Fetch profile failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: string) => {
    setSaving(true);
    try {
      const updated = { ...profile, [field]: value };
      const res = await api.put('/vendor/profile', updated);
      if (res.data.success) {
        setProfile(res.data.data);
        Alert.alert('Success', 'Business details updated');
      }
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Business Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-slate-50" 
        showsVerticalScrollIndicator={false}
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
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Business Profile</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Settings</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            {saving && <ActivityIndicator size="small" color="#2563eb" />}
            <HeaderNotificationIcon role="vendor" />
          </View>
        </View>

        <View className="px-6 pb-20">
          {/* Profile Identity Small Box */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm items-center mb-4 mt-6">
            <View className="w-24 h-24 bg-slate-50 rounded-[32px] items-center justify-center border-4 border-white shadow-xl mb-4 overflow-hidden">
              {profile?.companyName ? (
                <Text className="text-4xl font-black text-slate-300">{profile.companyName.charAt(0)}</Text>
              ) : (
                <Globe size={40} color="#cbd5e1" />
              )}
            </View>
            <Text className="text-xl font-black text-slate-900 text-center mb-2">
              {profile?.companyName || 'Unknown Business'}
            </Text>
            <View className="flex-row items-center justify-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <ShieldCheck size={14} color="#059669" />
              <Text className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Vendor</Text>
            </View>
          </View>

          {/* Company Info Box */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm mb-10">
            <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Business Details</Text>
            
            <View className="flex-row flex-wrap justify-between">
              <View className="w-full bg-slate-50 rounded-[24px] p-4 mb-4 relative">
                <View className="flex-row items-center gap-3 mb-1">
                  <Globe size={14} color="#64748b" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Company Name</Text>
                </View>
                <Text className="text-sm font-bold text-slate-700 ml-7">{profile?.companyName}</Text>
                <TouchableOpacity className="absolute top-4 right-4">
                  <Edit2 size={14} color="#2563eb" />
                </TouchableOpacity>
              </View>

              <View className="w-[48%] bg-slate-50 rounded-[24px] p-4 mb-4">
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Business ID</Text>
                <Text className="text-[11px] font-black text-slate-700 font-mono" numberOfLines={1}>#{profile?.vendorId?.slice(-8).toUpperCase()}</Text>
              </View>

              <View className="w-[48%] bg-slate-50 rounded-[24px] p-4 mb-4 relative">
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</Text>
                <Text className="text-[11px] font-black text-emerald-600 uppercase">Active</Text>
              </View>

              <View className="w-full bg-slate-50 rounded-[24px] p-4 mb-4 relative">
                <View className="flex-row items-center gap-3 mb-1">
                  <Mail size={14} color="#64748b" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</Text>
                </View>
                <Text className="text-sm font-bold text-slate-700 ml-7">{profile?.email}</Text>
              </View>

              <View className="w-full bg-slate-50 rounded-[24px] p-4 mb-4 relative">
                <View className="flex-row items-center gap-3 mb-1">
                  <Phone size={14} color="#64748b" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</Text>
                </View>
                <Text className="text-sm font-bold text-slate-700 ml-7">{profile?.phone}</Text>
                <TouchableOpacity className="absolute top-4 right-4">
                  <Edit2 size={14} color="#2563eb" />
                </TouchableOpacity>
              </View>

              <View className="w-full bg-slate-50 rounded-[24px] p-5 relative mt-2 border border-slate-100">
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Location</Text>
                <View className="flex-row items-start gap-3 pr-8">
                  <MapPin size={18} color="#f43f5e" />
                  <Text className="text-xs font-bold text-slate-600 leading-5">
                    {profile?.businessLocation || 'Business location details not configured'}
                  </Text>
                </View>
                <TouchableOpacity className="absolute top-5 right-5">
                  <Edit2 size={14} color="#2563eb" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="w-full mt-8 py-4 bg-slate-900 rounded-2xl items-center shadow-lg shadow-slate-200">
              <Text className="text-white font-black text-xs uppercase tracking-widest">Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
