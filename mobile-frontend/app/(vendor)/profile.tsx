import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MapPin, Edit2, CheckCircle2, Save, Globe } from 'lucide-react-native';
import api from '../../services/api';

export default function VendorProfile() {
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
        Alert.alert('Success', 'Profile updated successfully');
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
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Business Profile</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Account & company settings</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {saving && <ActivityIndicator size="small" color="#2563eb" />}
            <TouchableOpacity 
              className="bg-slate-900 px-4 py-2.5 rounded-xl shadow-sm"
              // You can expand this to save multiple edits at once if needed
            >
              <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Identity Small Box */}
        <View className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm items-center mb-4">
          <View className="w-20 h-20 bg-slate-50 rounded-[20px] items-center justify-center border-4 border-white shadow-sm mb-4">
            {profile?.companyName ? (
              <Text className="text-3xl font-bold text-slate-300">{profile.companyName.charAt(0)}</Text>
            ) : (
              <Globe size={32} color="#cbd5e1" />
            )}
          </View>
          <Text className="text-lg font-bold text-slate-900 text-center mb-2">
            {profile?.companyName || 'Unknown Business'}
          </Text>
          <View className="flex-row items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
            <CheckCircle2 size={12} color="#059669" />
            <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Vendor</Text>
          </View>
        </View>

        {/* Company Info Box */}
        <View className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm mb-10">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Business Details</Text>
          
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] bg-slate-50 rounded-2xl p-3 mb-3 relative">
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company</Text>
              <Text className="text-xs font-bold text-slate-700" numberOfLines={1}>{profile?.companyName}</Text>
              <TouchableOpacity className="absolute top-2 right-2 p-1">
                <Edit2 size={12} color="#2563eb" />
              </TouchableOpacity>
            </View>

            <View className="w-[48%] bg-slate-50 rounded-2xl p-3 mb-3">
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business ID</Text>
              <Text className="text-[11px] font-bold text-slate-700 font-mono" numberOfLines={1}>{profile?.vendorId || profile?._id}</Text>
            </View>

            <View className="w-[48%] bg-slate-50 rounded-2xl p-3 mb-3 relative">
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</Text>
              <Text className="text-xs font-bold text-slate-700" numberOfLines={1}>{profile?.email}</Text>
              <TouchableOpacity className="absolute top-2 right-2 p-1">
                <Edit2 size={12} color="#2563eb" />
              </TouchableOpacity>
            </View>

            <View className="w-[48%] bg-slate-50 rounded-2xl p-3 mb-3 relative">
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</Text>
              <Text className="text-xs font-bold text-slate-700" numberOfLines={1}>{profile?.phone}</Text>
              <TouchableOpacity className="absolute top-2 right-2 p-1">
                <Edit2 size={12} color="#2563eb" />
              </TouchableOpacity>
            </View>

            <View className="w-full bg-slate-50 rounded-2xl p-4 relative mt-1">
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location</Text>
              <View className="flex-row items-center gap-2">
                <MapPin size={14} color="#f43f5e" />
                <Text className="text-xs font-bold text-slate-700 flex-1" numberOfLines={2}>
                  {profile?.businessLocation || 'Location not set'}
                </Text>
              </View>
              <TouchableOpacity className="absolute top-3 right-3 p-1">
                <Edit2 size={12} color="#2563eb" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
