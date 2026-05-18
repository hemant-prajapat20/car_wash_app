import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, TextInput, Alert 
} from 'react-native';
import { Package, Plus, Trash2, Edit2, Clock, X, Save, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

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
  const navigation = useNavigation();
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
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Services</Text>
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Package Catalog</Text>
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
          {services.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <Package size={48} color="#cbd5e1" className="mb-4 opacity-50" />
              <Text className="text-slate-900 font-bold text-base mb-1">Catalog Empty</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                Click the + icon to create your first package
              </Text>
            </View>
          ) : (
            services.map((service) => (
              <View key={service._id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
                <View className="flex-row items-start justify-between mb-5">
                  <View className="w-14 h-14 bg-blue-50 rounded-[20px] items-center justify-center">
                    <Package size={24} color="#2563eb" />
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => openEditModal(service)} className="p-2.5 bg-slate-50 rounded-xl">
                      <Edit2 size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(service._id)} className="p-2.5 bg-rose-50 rounded-xl">
                      <Trash2 size={16} color="#f43f5e" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-base font-black text-slate-900 leading-tight mb-2">{service.name}</Text>
                  <View className="bg-blue-50 px-3 py-1 rounded-lg self-start mb-3">
                    <Text className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{service.category}</Text>
                  </View>
                  <Text className="text-xs font-medium text-slate-500 leading-5" numberOfLines={3}>{service.description}</Text>
                </View>

                <View className="flex-row items-center justify-between pt-5 border-t border-slate-50">
                  <Text className="text-lg font-black text-slate-900">₹{service.price}</Text>
                  <View className="flex-row items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Clock size={14} color="#94a3b8" />
                    <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{service.duration} Min</Text>
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
          <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl h-[85%]">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-2xl font-black text-slate-900">
                  {editingService ? 'Edit Package' : 'New Package'}
                </Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Catalog Details</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-6">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Package Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="e.g. Premium Shine"
                  className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                />
              </View>

              <View className="mb-6">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Description</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholder="Briefly describe the inclusions..."
                  multiline
                  className="w-full bg-slate-50 border border-slate-100 h-32 rounded-2xl px-5 py-5 text-slate-900 font-bold text-xs"
                />
              </View>

              <View className="flex-row gap-4 mb-6">
                <View className="flex-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (₹)</Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(text) => setFormData({...formData, price: text})}
                    placeholder="Price"
                    keyboardType="numeric"
                    className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Duration (Min)</Text>
                  <TextInput
                    value={formData.duration}
                    onChangeText={(text) => setFormData({...formData, duration: text})}
                    placeholder="Mins"
                    keyboardType="numeric"
                    className="w-full bg-slate-50 border border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold"
                  />
                </View>
              </View>

              <View className="mb-10">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Category Select</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setFormData({...formData, category: cat})}
                      className={`px-5 py-3 rounded-2xl mr-2 border-2 ${formData.category === cat ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-50'}`}
                    >
                      <Text className={`text-[10px] font-black uppercase tracking-widest ${formData.category === cat ? 'text-white' : 'text-slate-500'}`}>
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
              className={`w-full h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-lg ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 shadow-slate-200'}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-white font-black text-xs uppercase tracking-widest">
                    {editingService ? 'Update Package' : 'Confirm Package'}
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
