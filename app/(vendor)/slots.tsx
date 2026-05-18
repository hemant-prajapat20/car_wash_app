import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, TextInput, Alert 
} from 'react-native';
import { Clock, Plus, Trash2, Edit2, Calendar, X, Save, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

interface Slot {
  _id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  maxBookings: number;
  currentBookings: number;
  isAvailable: boolean;
}

export default function VendorSlots() {
  const navigation = useNavigation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek: 'All',
    maxBookings: '1'
  });

  const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchSlots = async () => {
    try {
      const res = await api.get('/vendor/slots');
      if (res.data.success) setSlots(res.data.data);
    } catch (err) {
      console.error('Failed to load slots', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSlots();
  };

  const handleSave = async () => {
    const maxB = parseInt(formData.maxBookings);
    if (isNaN(maxB) || maxB < 1) {
      Alert.alert('Invalid Input', 'Max bookings must be at least 1');
      return;
    }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.startTime) || !timeRegex.test(formData.endTime)) {
      Alert.alert('Invalid Format', 'Please use HH:MM format for times (e.g. 09:00)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, maxBookings: maxB };
      if (editingSlot) {
        await api.put(`/vendor/slots/${editingSlot._id}`, payload);
      } else {
        await api.post('/vendor/slots', payload);
      }
      setIsModalOpen(false);
      fetchSlots();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Slot',
      'Are you sure you want to remove this availability slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/vendor/slots/${id}`);
              fetchSlots();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete slot');
            }
          }
        }
      ]
    );
  };

  const openAddModal = () => {
    setEditingSlot(null);
    setFormData({ startTime: '09:00', endTime: '10:00', dayOfWeek: 'All', maxBookings: '1' });
    setIsModalOpen(true);
  };

  const openEditModal = (slot: Slot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      dayOfWeek: slot.dayOfWeek,
      maxBookings: slot.maxBookings.toString()
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Availability...</Text>
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
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Availability</Text>
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Time Management</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={openAddModal}
              className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-lg shadow-slate-200"
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
            <HeaderNotificationIcon role="vendor" />
          </View>
        </View>

        <View className="px-6 pb-20 pt-6">
          {slots.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <Calendar size={48} color="#cbd5e1" className="mb-4 opacity-50" />
              <Text className="text-slate-900 font-bold text-base mb-1">No Slots Configured</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                Click the + icon to initialize your first booking window
              </Text>
            </View>
          ) : (
            slots.map((slot) => {
              const utilPercentage = slot.maxBookings > 0 ? (slot.currentBookings / slot.maxBookings) * 100 : 0;
              const isFull = slot.currentBookings >= slot.maxBookings;

              return (
                <View key={slot._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
                  <View className="flex-row items-start justify-between mb-5">
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 bg-blue-50 rounded-[20px] items-center justify-center">
                        <Clock size={22} color="#2563eb" />
                      </View>
                      <View>
                        <Text className="text-base font-black text-slate-900">{slot.startTime} - {slot.endTime}</Text>
                        <View className="bg-slate-100 px-2 py-0.5 rounded-lg self-start mt-1">
                          <Text className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{slot.dayOfWeek}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => openEditModal(slot)} className="p-2.5 bg-slate-50 rounded-xl">
                        <Edit2 size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(slot._id)} className="p-2.5 bg-rose-50 rounded-xl">
                        <Trash2 size={16} color="#f43f5e" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="pt-4 border-t border-slate-50">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilization</Text>
                      <Text className={`text-[9px] font-black uppercase ${isFull ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {slot.currentBookings} / {slot.maxBookings} Bookings
                      </Text>
                    </View>
                    <View className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <View 
                        style={{ width: `${utilPercentage}%` }} 
                        className={`h-full ${isFull ? 'bg-rose-500' : 'bg-blue-600'}`} 
                      />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-2xl font-black text-slate-900">
                  {editingSlot ? 'Edit Window' : 'New Window'}
                </Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Capacity</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Time</Text>
                <TextInput
                  value={formData.startTime}
                  onChangeText={(text) => setFormData({...formData, startTime: text})}
                  placeholder="09:00"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">End Time</Text>
                <TextInput
                  value={formData.endTime}
                  onChangeText={(text) => setFormData({...formData, endTime: text})}
                  placeholder="10:00"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Active Day Selection</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setFormData({...formData, dayOfWeek: day})}
                    className={`px-5 py-3 rounded-2xl mr-2 border-2 ${formData.dayOfWeek === day ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-50'}`}
                  >
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${formData.dayOfWeek === day ? 'text-white' : 'text-slate-500'}`}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="mb-10">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Max Bookings Capacity</Text>
              <TextInput
                value={formData.maxBookings}
                onChangeText={(text) => setFormData({...formData, maxBookings: text})}
                keyboardType="numeric"
                className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className={`w-full h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-lg ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 shadow-slate-200'}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-white font-black text-xs uppercase tracking-widest">
                    {editingSlot ? 'Update Window' : 'Initialize Slot'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
