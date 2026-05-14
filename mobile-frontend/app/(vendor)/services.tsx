import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, TextInput, Alert 
} from 'react-native';
import { Package, Plus, Trash2, Edit2, Clock, X, Save } from 'lucide-react-native';
import api from '../../services/api';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export default function VendorServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'Basic Wash'
  });

  const categories = ['Basic Wash', 'Premium Detail', 'Interior Cleaning', 'Polishing', 'Full Service'];

  const fetchServices = async () => {
    try {
      const res = await api.get('/vendor/services');
      if (res.data.success) setServices(res.data.data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const handleSave = async () => {
    const finalPrice = Math.max(1, parseInt(formData.price) || 0);
    const finalDuration = Math.max(1, parseInt(formData.duration) || 0);

    if (!formData.name || !formData.description) {
      Alert.alert('Validation Error', 'Name and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: finalPrice, duration: finalDuration };
      if (editingService) {
        await api.put(`/vendor/services/${editingService._id}`, payload);
      } else {
        await api.post('/vendor/services', payload);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Package',
      'Are you sure you want to remove this service package?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/vendor/services/${id}`);
              fetchServices();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: '', duration: '', category: 'Basic Wash' });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Catalog...</Text>
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
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Service Packages</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage wash catalog</Text>
          </View>
          <TouchableOpacity 
            onPress={openAddModal}
            className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-md shadow-slate-300"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-10">
          {services.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm mt-4">
              <Package size={48} color="#cbd5e1" className="mb-4" />
              <Text className="text-slate-900 font-bold text-base mb-1">Catalog Empty</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                Click the + icon to create your first package
              </Text>
            </View>
          ) : (
            services.map((service) => (
              <View key={service._id} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm mt-4">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center">
                    <Package size={20} color="#2563eb" />
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => openEditModal(service)} className="p-2 bg-slate-50 rounded-lg">
                      <Edit2 size={14} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(service._id)} className="p-2 bg-rose-50 rounded-lg">
                      <Trash2 size={14} color="#f43f5e" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-base font-bold text-slate-900 leading-tight mb-1">{service.name}</Text>
                  <View className="bg-blue-50 px-2 py-1 rounded-md self-start mb-2">
                    <Text className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">{service.category}</Text>
                  </View>
                  <Text className="text-xs text-slate-500 leading-relaxed" numberOfLines={2}>{service.description}</Text>
                </View>

                <View className="flex-row items-center justify-between pt-4 border-t border-slate-50">
                  <Text className="text-base font-bold text-slate-900">₹{service.price}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.duration} Min</Text>
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
          <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 shadow-2xl h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900">
                {editingService ? 'Edit Package' : 'New Package'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Package Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="e.g. Premium Shine"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                />
              </View>

              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholder="Briefly describe the inclusions..."
                  multiline
                  className="w-full bg-slate-50 border border-slate-100 h-24 rounded-2xl px-4 py-4 text-slate-900 font-bold text-xs"
                />
              </View>

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (₹)</Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(text) => setFormData({...formData, price: text})}
                    placeholder="Price"
                    keyboardType="numeric"
                    className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Duration (Min)</Text>
                  <TextInput
                    value={formData.duration}
                    onChangeText={(text) => setFormData({...formData, duration: text})}
                    placeholder="Mins"
                    keyboardType="numeric"
                    className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-4 text-slate-900 font-bold"
                  />
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setFormData({...formData, category: cat})}
                      className={`px-4 py-2.5 rounded-xl mr-2 border ${formData.category === cat ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <Text className={`text-[11px] font-bold uppercase tracking-widest ${formData.category === cat ? 'text-white' : 'text-slate-500'}`}>
                        {cat}
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
                    {editingService ? 'Update Package' : 'Confirm Package'}
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
