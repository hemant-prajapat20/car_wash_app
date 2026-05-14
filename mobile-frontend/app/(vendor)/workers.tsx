import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, TextInput, Alert 
} from 'react-native';
import { Contact, Plus, Trash2, Edit2, Mail, Phone, X, Save } from 'lucide-react-native';
import api from '../../services/api';

interface Worker {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export default function VendorWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Washer',
    status: 'Active'
  });

  const roles = ['Washer', 'Detailer', 'Supervisor', 'Specialist'];

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/vendor/workers');
      if (res.data.success) setWorkers(res.data.data);
    } catch (err) {
      console.error('Failed to load workers', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkers();
  };

  const handleSave = async () => {
    if (!/^\d{10}$/.test(formData.phone)) {
      Alert.alert('Validation Error', 'Phone must be exactly 10 digits');
      return;
    }

    if (!formData.name || !formData.email) {
      Alert.alert('Validation Error', 'Name and email are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingWorker) {
        await api.put(`/vendor/workers/${editingWorker._id}`, formData);
      } else {
        await api.post('/vendor/workers', formData);
      }
      setIsModalOpen(false);
      fetchWorkers();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Worker',
      'Are you sure you want to remove this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/vendor/workers/${id}`);
              fetchWorkers();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete worker');
            }
          }
        }
      ]
    );
  };

  const openAddModal = () => {
    setEditingWorker(null);
    setFormData({ name: '', email: '', phone: '', role: 'Washer', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      role: worker.role,
      status: worker.status
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Personnel...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pt-6 pb-4 px-6 flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Staff Management</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Directory</Text>
          </View>
          <TouchableOpacity 
            onPress={openAddModal}
            className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-md shadow-slate-300"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-10">
          {workers.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm mt-4">
              <Contact size={48} color="#cbd5e1" className="mb-4" />
              <Text className="text-slate-900 font-bold text-base mb-1">No Staff Added</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                Click the + icon to add your first team member
              </Text>
            </View>
          ) : (
            workers.map((worker) => (
              <View key={worker._id} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm mt-4">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center">
                    <Contact size={24} color="#2563eb" />
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => openEditModal(worker)} className="p-2 bg-slate-50 rounded-lg">
                      <Edit2 size={14} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(worker._id)} className="p-2 bg-rose-50 rounded-lg">
                      <Trash2 size={14} color="#f43f5e" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-5">
                  <Text className="text-base font-bold text-slate-900 leading-tight mb-1">{worker.name}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{worker.role}</Text>
                    <View className="w-1 h-1 bg-slate-200 rounded-full" />
                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${worker.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {worker.status}
                    </Text>
                  </View>
                </View>

                <View className="space-y-3 pt-4 border-t border-slate-50">
                  <View className="flex-row items-center gap-3">
                    <Mail size={14} color="#94a3b8" />
                    <Text className="text-xs font-semibold text-slate-600">{worker.email}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Phone size={14} color="#94a3b8" />
                    <Text className="text-xs font-semibold text-slate-600">{worker.phone}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 shadow-2xl h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900">
                {editingWorker ? 'Edit Personnel' : 'New Staff Member'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                />
              </View>

              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="staff@chakachak.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                />
              </View>

              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text.replace(/\D/g, '')})}
                  placeholder="10 digit number"
                  keyboardType="numeric"
                  maxLength={10}
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                />
              </View>

              <View className="mb-8">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Operational Role</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setFormData({...formData, role: role})}
                      className={`px-4 py-2.5 rounded-xl mr-2 border ${formData.role === role ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <Text className={`text-[11px] font-bold uppercase tracking-widest ${formData.role === role ? 'text-white' : 'text-slate-500'}`}>
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className={`w-full h-14 rounded-[20px] flex-row items-center justify-center gap-2 mt-4 ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900'}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={18} color="white" />
                  <Text className="text-white font-bold text-sm uppercase tracking-widest">
                    {editingWorker ? 'Update Personnel' : 'Initialize Member'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
