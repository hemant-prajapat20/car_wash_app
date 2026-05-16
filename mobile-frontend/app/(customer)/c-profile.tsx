import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, 
  ScrollView, Image, TextInput, Modal, Alert, RefreshControl 
} from 'react-native';
import { 
  User, Camera, Car, Trash2, Plus, ShieldCheck, 
  Mail, Phone, X, Save, Menu, ChevronRight 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function CustomerProfile() {
  const { user } = useSelector((state: any) => state.auth);
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    plateNumber: ''
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/customer/vehicles');
      if (res.data.success) setVehicles(res.data.data);
    } catch (err) {
      console.error('Fetch vehicles failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.plateNumber) {
      Alert.alert('Validation Error', 'All vehicle fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/customer/vehicles', newVehicle);
      if (res.data.success) {
        setVehicles(res.data.data);
        setIsModalOpen(false);
        setNewVehicle({ make: '', model: '', plateNumber: '' });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    Alert.alert(
      'Remove Vehicle',
      'Are you sure you want to remove this vehicle from your garage?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await api.delete(`/customer/vehicles/${id}`);
              if (res.data.success) setVehicles(res.data.data);
            } catch (err) {
              Alert.alert('Error', 'Failed to remove vehicle');
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#2563eb" size="large" />
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Syncing Garage...</Text>
      </View>
    );
  }

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
            <Text className="text-xl font-black text-slate-900 tracking-tighter">My Profile</Text>
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Account Settings</Text>
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
          {/* User Info Card */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm items-center mb-6">
            <View className="relative w-28 h-28 mb-6">
              <View className="w-full h-full bg-slate-50 rounded-[36px] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} className="w-full h-full object-cover" />
                ) : (
                  <User size={36} color="#cbd5e1" />
                )}
              </View>
              <TouchableOpacity className="absolute -bottom-1 -right-1 w-11 h-11 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-200 border-4 border-white">
                <Camera size={18} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">{user?.fullName}</Text>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Chakachak Customer</Text>

            <View className="w-full mt-8 pt-8 border-t border-slate-50 gap-4">
               <View className="flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                 <View className="w-9 h-9 bg-white items-center justify-center rounded-xl shadow-sm">
                    <Mail size={16} color="#94a3b8" />
                 </View>
                 <View>
                   <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</Text>
                   <Text className="text-xs font-bold text-slate-700">{user?.email}</Text>
                 </View>
               </View>
               <View className="flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                 <View className="w-9 h-9 bg-white items-center justify-center rounded-xl shadow-sm">
                    <Phone size={16} color="#94a3b8" />
                 </View>
                 <View>
                   <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Number</Text>
                   <Text className="text-xs font-bold text-slate-700">{user?.phone || 'Not provided'}</Text>
                 </View>
               </View>
            </View>
          </View>

          {/* Garage Card */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
             <View className="flex-row items-center justify-between mb-8">
                <View>
                   <Text className="text-sm font-black text-slate-900 uppercase tracking-tight">My Garage</Text>
                   <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saved Vehicles</Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                   <Text className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{vehicles.length} Active</Text>
                </View>
             </View>
             
             <View className="gap-4">
                {vehicles.map((v: any) => (
                  <View key={v._id} className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Car size={22} color="#2563eb" />
                      </View>
                      <View>
                        <Text className="text-[14px] font-black text-slate-900">{v.make} {v.model}</Text>
                        <View className="bg-blue-600 px-2 py-0.5 rounded mt-1.5 self-start">
                           <Text className="text-[9px] font-black text-white uppercase tracking-widest">{v.plateNumber}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleDeleteVehicle(v._id)}
                      className="w-9 h-9 bg-rose-50 items-center justify-center rounded-xl"
                    >
                      <Trash2 size={16} color="#f43f5e" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <TouchableOpacity 
                  onPress={() => setIsModalOpen(true)}
                  className="p-6 border-2 border-dashed border-slate-200 rounded-[28px] flex-row items-center justify-center gap-3 mt-2"
                >
                  <Plus size={20} color="#94a3b8" />
                  <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add New Vehicle</Text>
                </TouchableOpacity>
             </View>
          </View>

          <TouchableOpacity className="w-full mt-8 py-5 bg-slate-900 rounded-[24px] items-center shadow-lg shadow-slate-200">
             <Text className="text-white font-black text-xs uppercase tracking-widest">Sign Out Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Vehicle Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl h-[70%]">
            <View className="flex-row justify-between items-center mb-10">
              <View>
                <Text className="text-2xl font-black text-slate-900">Add Vehicle</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Expand your garage</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Vehicle Make</Text>
                <TextInput
                  value={newVehicle.make}
                  onChangeText={(text) => setNewVehicle({...newVehicle, make: text})}
                  placeholder="e.g. Tesla"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Model</Text>
                <TextInput
                  value={newVehicle.model}
                  onChangeText={(text) => setNewVehicle({...newVehicle, model: text})}
                  placeholder="e.g. Model 3"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                />
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plate Number</Text>
              <TextInput
                value={newVehicle.plateNumber}
                onChangeText={(text) => setNewVehicle({...newVehicle, plateNumber: text.toUpperCase()})}
                placeholder="e.g. XYZ-1234"
                className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-black tracking-widest"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddVehicle}
              disabled={isSubmitting}
              className={`w-full h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-lg ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 shadow-blue-200'}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-white font-black text-xs uppercase tracking-widest">Save to Garage</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
