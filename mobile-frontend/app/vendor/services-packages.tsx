import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, FlatList } from 'react-native';
import { Plus, Package, Clock, DollarSign, Edit2, Trash2, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FadeInView } from '../../components/ui/FadeInView';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  isActive: boolean;
}

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Basic Exterior Wash',
    description: 'Complete exterior hand wash, wheel cleaning, and tire dressing.',
    price: 25,
    duration: '30 mins',
    isActive: true,
  },
  {
    id: '2',
    name: 'Premium Interior Detail',
    description: 'Deep vacuuming, leather conditioning, and dashboard polish.',
    price: 85,
    duration: '90 mins',
    isActive: true,
  },
  {
    id: '3',
    name: 'Full Valet Service',
    description: 'Combined interior and exterior deep cleaning with wax protection.',
    price: 150,
    duration: '3 hours',
    isActive: false,
  },
];

export default function ServicesPackagesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const isWeb = Platform.OS === 'web';

  const toggleStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const ServiceCard = ({ item }: { item: Service }) => (
    <Card className="mb-4 overflow-hidden border-slate-100 shadow-sm">
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-slate-900 font-inter-semibold text-base mb-1">{item.name}</Text>
            <Text className="text-slate-500 text-xs font-inter-regular leading-4 pr-4">{item.description}</Text>
          </View>
          <View className={`px-2 py-1 rounded-full ${item.isActive ? 'bg-emerald-50' : 'bg-slate-100'}`}>
            <Text className={`text-[10px] font-inter-bold uppercase tracking-wider ${item.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-6 mt-4 pt-4 border-t border-slate-50">
          <View className="flex-row items-center gap-1.5">
            <View className="w-7 h-7 bg-primary-50 rounded-lg items-center justify-center">
              <DollarSign size={14} color="#0284c7" />
            </View>
            <View>
              <Text className="text-slate-400 text-[9px] font-inter-bold uppercase tracking-widest">Price</Text>
              <Text className="text-slate-900 font-inter-semibold text-sm">${item.price}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5">
            <View className="w-7 h-7 bg-amber-50 rounded-lg items-center justify-center">
              <Clock size={14} color="#d97706" />
            </View>
            <View>
              <Text className="text-slate-400 text-[9px] font-inter-bold uppercase tracking-widest">Duration</Text>
              <Text className="text-slate-900 font-inter-semibold text-sm">{item.duration}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-slate-50/50 px-5 py-3 flex-row justify-between items-center border-t border-slate-100">
        <View className="flex-row gap-2">
          <Pressable className="w-8 h-8 bg-white border border-slate-200 rounded-lg items-center justify-center active:bg-slate-50">
            <Edit2 size={14} color="#64748b" />
          </Pressable>
          <Pressable className="w-8 h-8 bg-white border border-slate-200 rounded-lg items-center justify-center active:bg-red-50">
            <Trash2 size={14} color="#ef4444" />
          </Pressable>
        </View>
        <Button 
          variant={item.isActive ? 'ghost' : 'outline'} 
          size="sm" 
          className={`px-4 py-1.5 rounded-lg border-slate-200`}
          onPress={() => toggleStatus(item.id)}
        >
          <Text className={`text-[11px] font-inter-semibold ${item.isActive ? 'text-slate-500' : 'text-primary-600'}`}>
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </Button>
      </View>
    </Card>
  );

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <FadeInView>
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-slate-900 font-inter-semibold text-2xl tracking-tight">Services & Packages</Text>
            <Text className="text-slate-500 text-sm font-inter-regular mt-1">Manage your service offerings and pricing</Text>
          </View>
          {!isWeb && (
            <Pressable className="w-12 h-12 bg-primary-600 rounded-2xl items-center justify-center shadow-lg shadow-primary-200">
              <Plus size={24} color="#fff" />
            </Pressable>
          )}
        </View>

        {isWeb && (
          <View className="flex-row justify-between items-center mb-6 p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-primary-600 rounded-xl items-center justify-center">
                <Package size={20} color="#fff" />
              </View>
              <View>
                <Text className="text-primary-900 font-inter-semibold text-sm">Create New Service</Text>
                <Text className="text-primary-600 text-xs font-inter-regular">Add a new car wash package to your list</Text>
              </View>
            </View>
            <Button size="md" className="px-6 rounded-xl">
              <Plus size={18} color="#fff" className="mr-2" />
              <Text className="text-white font-inter-semibold">Add Service</Text>
            </Button>
          </View>
        )}

        <View className="flex-row flex-wrap -m-2">
          {services.map(item => (
            <View key={item.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
              <ServiceCard item={item} />
            </View>
          ))}
          
          {/* Empty State / Add Card for Web */}
          {isWeb && (
            <View className="w-full md:w-1/2 lg:w-1/3 p-2">
              <Pressable className="flex-1 min-h-[220px] border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center p-6 hover:border-primary-300 transition-colors group">
                <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mb-3 group-hover:bg-primary-50">
                  <Plus size={24} color="#94a3b8" />
                </View>
                <Text className="text-slate-400 font-inter-semibold text-sm group-hover:text-primary-600">Add New Package</Text>
              </Pressable>
            </View>
          )}
        </View>
      </FadeInView>
    </ScrollView>
  );
}
