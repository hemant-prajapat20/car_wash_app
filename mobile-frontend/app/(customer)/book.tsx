import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Car, Package, Clock, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import api from '../../services/api';

const STEPS = ['Vehicle', 'Service', 'Time Slot', 'Confirmation'];

export default function BookServiceScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const vendorId = params.vendor;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    vehicle: null as any,
    service: null as any,
    slot: null as any,
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get('/customer/search');
        const vendor = res.data.data.find((v: any) => v._id === vendorId);
        setVendorData(vendor);
      } catch (err) {
        console.error('Failed to fetch vendor', err);
      }
    };
    if (vendorId) fetchVendor();
  }, [vendorId]);

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        vendorId,
        vehicle: bookingData.vehicle,
        service: bookingData.service,
        slot: {
          date: new Date(),
          time: bookingData.slot
        }
      };
      const response = await api.post('/customer/bookings', payload);
      if (response.data.success) {
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Booking failed', err);
      alert('Failed to create booking. Please check slot availability.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 3) handleFinalBooking();
    else setCurrentStep(prev => prev + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        <View className="items-center mb-8">
          <Text className="text-xl font-bold text-slate-900">Book at {vendorData?.companyName || 'Center'}</Text>
          <Text className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Select your preferences below</Text>
        </View>

        {/* Step Indicator */}
        <View className="flex-row items-center justify-between mb-8">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <View className="items-center gap-2">
                <View className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
                  currentStep > i + 1 ? 'bg-emerald-500 border-emerald-500' :
                  currentStep === i + 1 ? 'bg-blue-600 border-blue-600' :
                  'bg-white border-slate-200'
                }`}>
                  {currentStep > i + 1 ? <CheckCircle2 size={16} color="white" /> : <Text className={`text-[11px] font-bold ${currentStep === i + 1 ? 'text-white' : 'text-slate-400'}`}>{i + 1}</Text>}
                </View>
                <Text className={`text-[9px] font-bold uppercase ${currentStep === i + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{step}</Text>
              </View>
              {i < STEPS.length - 1 && <View className={`h-[2px] flex-1 mx-2 ${currentStep > i + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </View>

        {/* Form Container */}
        <View className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm min-h-[400px]">
          
          {currentStep === 1 && (
            <View className="flex-1 gap-4">
               <Text className="text-sm font-bold text-slate-900 mb-2">Your Vehicles</Text>
               {['Tesla Model 3', 'BMW X5'].map(v => (
                 <TouchableOpacity 
                    key={v} 
                    onPress={() => setBookingData({...bookingData, vehicle: { make: v.split(' ')[0], model: v.split(' ')[1], plateNumber: 'ABC-123' }})} 
                    className={`p-5 rounded-2xl flex-row items-center gap-4 border ${bookingData.vehicle?.make === v.split(' ')[0] ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`}
                  >
                    <Car color="#94a3b8" size={24} />
                    <Text className="text-sm font-bold text-slate-900">{v}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          )}

          {currentStep === 2 && (
            <View className="flex-1 gap-3">
               <Text className="text-sm font-bold text-slate-900 mb-2">Select Service</Text>
               {(vendorData?.services || []).map((s: any) => (
                 <TouchableOpacity 
                    key={s.name} 
                    onPress={() => setBookingData({...bookingData, service: s})} 
                    className={`p-5 rounded-2xl flex-row justify-between items-center border ${bookingData.service?.name === s.name ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`}
                  >
                    <View>
                      <Text className="text-sm font-bold text-slate-900">{s.name}</Text>
                      <Text className="text-[10px] text-slate-400 mt-1">{s.duration} mins</Text>
                    </View>
                    <Text className="text-lg font-bold text-blue-600">₹{s.price}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          )}

          {currentStep === 3 && (
            <View className="flex-1">
               <Text className="text-sm font-bold text-slate-900 mb-4">Select Time Slot</Text>
               <View className="flex-row flex-wrap justify-between gap-y-3">
                 {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                   <TouchableOpacity 
                      key={t} 
                      onPress={() => setBookingData({...bookingData, slot: t})} 
                      className={`w-[48%] py-4 rounded-xl items-center border ${bookingData.slot === t ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
                    >
                      <Text className={`text-xs font-bold ${bookingData.slot === t ? 'text-white' : 'text-slate-600'}`}>{t} AM</Text>
                   </TouchableOpacity>
                 ))}
               </View>
            </View>
          )}

          {currentStep === 4 && (
            <View className="flex-1 items-center justify-center pt-10">
               <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-6">
                 <CheckCircle2 size={40} color="#059669" />
               </View>
               <Text className="text-2xl font-bold text-slate-900 mb-8">Booking Successful!</Text>
               <TouchableOpacity 
                  onPress={() => router.push('/(customer)/bookings')} 
                  className="w-full py-4 bg-slate-900 rounded-2xl items-center"
                >
                  <Text className="text-white text-xs font-bold uppercase tracking-widest">View My Bookings</Text>
               </TouchableOpacity>
            </View>
          )}

          {currentStep < 4 && (
            <View className="mt-8 pt-6 border-t border-slate-50 flex-row items-center justify-between">
              <TouchableOpacity 
                onPress={() => setCurrentStep(prev => prev - 1)} 
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'opacity-0' : ''}
              >
                <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={nextStep} 
                disabled={loading} 
                className="px-8 py-4 bg-slate-900 rounded-xl flex-row items-center gap-2"
              >
                 {loading ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white text-[11px] font-bold uppercase tracking-widest">{currentStep === 3 ? 'Confirm' : 'Continue'}</Text>}
                 {!loading && <ChevronRight size={16} color="white" />}
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
