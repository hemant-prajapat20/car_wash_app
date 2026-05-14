import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { User, Camera, Car, Trash2, Plus, ShieldCheck } from 'lucide-react-native';
import api from '../../services/api';

export default function CustomerProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfile({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 890',
          vehicles: [
            { make: 'Tesla', model: 'Model 3', plate: 'ABC-123' },
            { make: 'BMW', model: 'X5', plate: 'XYZ-789' }
          ],
          addresses: [
            { label: 'Home', val: '123 Main St, LA' }
          ]
        });
      } catch (err) {
        console.error('Fetch profile failed');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Your Profile</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your account and vehicles</Text>
          </View>
          <TouchableOpacity className="bg-slate-900 px-4 py-2.5 rounded-xl shadow-lg shadow-slate-200">
             <Text className="text-white text-[11px] font-bold uppercase tracking-widest">Save</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm items-center mb-6">
           <View className="relative w-24 h-24 mb-5">
             <View className="w-full h-full bg-slate-50 rounded-3xl flex items-center justify-center border-4 border-white shadow-sm">
               <User size={32} color="#cbd5e1" />
             </View>
             <TouchableOpacity className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
               <Camera size={18} color="white" />
             </TouchableOpacity>
           </View>
           <Text className="text-lg font-bold text-slate-900">{profile.fullName}</Text>
           <Text className="text-xs font-medium text-slate-400 mt-1">{profile.email}</Text>
        </View>

        <View className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
           <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Saved Vehicles</Text>
           
           <View className="gap-3">
              {profile.vehicles.map((v: any, i: number) => (
                <View key={i} className="p-4 bg-slate-50 rounded-2xl flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Car size={18} color="#94a3b8" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-slate-900">{v.make} {v.model}</Text>
                      <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{v.plate}</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="p-2">
                    <Trash2 size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex-row items-center justify-center gap-2 mt-2">
                <Plus size={18} color="#94a3b8" />
                <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">Add New Vehicle</Text>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
