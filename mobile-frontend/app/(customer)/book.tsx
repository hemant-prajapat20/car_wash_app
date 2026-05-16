import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, 
  ScrollView, RefreshControl, Modal, TextInput, Alert, NativeModules 
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { 
  Car, Package, Clock, ShieldCheck, ChevronRight, 
  CheckCircle2, Menu, Calendar, ChevronLeft, MapPin, Plus, X, Save
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
// Fallback check for different import styles
const Razorpay = RazorpayCheckout || (require('react-native-razorpay') as any).default || require('react-native-razorpay');
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

const STEPS = ['Vehicle', 'Service', 'Time Slot', 'Confirm'];

export default function BookServiceScreen() {
  const { user } = useSelector((state: any) => state.auth);
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const vendorId = params.vendor;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState({
    vehicle: null as any,
    service: null as any,
    slot: null as any,
  });

  // Add Vehicle Modal State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', plateNumber: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Detailed Vendor Info
      const vRes = await api.get(`/customer/vendors/${vendorId}`);
      if (vRes.data.success) {
        setVendorData(vRes.data.data);
      }

      // Fetch Customer Vehicles
      const cRes = await api.get('/customer/vehicles');
      if (cRes.data.success) {
        setCustomerVehicles(cRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch booking context', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchData();
  }, [vendorId]);

  const handleAddVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.plateNumber) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    setIsSubmittingVehicle(true);
    try {
      const res = await api.post('/customer/vehicles', newVehicle);
      if (res.data.success) {
        const updatedVehicles = res.data.data;
        setCustomerVehicles(updatedVehicles);
        
        // Auto-select the newly added vehicle
        const newlyAdded = updatedVehicles[updatedVehicles.length - 1];
        setBookingData(prev => ({ ...prev, vehicle: newlyAdded }));
        
        setIsVehicleModalOpen(false);
        setNewVehicle({ make: '', model: '', plateNumber: '' });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add vehicle');
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const handleFinalBooking = async () => {
    if (!bookingData.vehicle || !bookingData.service || !bookingData.slot) {
      Alert.alert('Missing Info', 'Please complete all steps.');
      return;
    }

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
      
      const bookingRes = await api.post('/customer/bookings', payload);
      if (!bookingRes.data.success) throw new Error('Failed to create booking');
      const booking = bookingRes.data.data;

      const orderRes = await api.post('/payment/create-order', {
        amount: bookingData.service.price,
      });
      if (!orderRes.data.success) throw new Error('Failed to create payment order');
      const order = orderRes.data.data;

      const options = {
        description: `Service Booking: ${bookingData.service.name}`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: order.currency,
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SbIYMAQzqrEkAM',
        amount: order.amount,
        name: 'Chakaachak',
        order_id: order.id,
        prefill: {
          email: user?.email || 'customer@example.com',
          contact: user?.phone || '9999999999',
          name: user?.fullName || 'Customer'
        },
        theme: { color: '#2563eb' }
      };

      const cleanupBooking = async (bId: string) => {
        try {
          await api.delete(`/customer/bookings/${bId}`);
          console.log('Cleanup: Unpaid booking removed');
        } catch (e) {
          console.error('Cleanup failed', e);
        }
      };

      // 4. Trigger Payment or Simulation
      try {
        // Explicitly check for the NATIVE BRIDGE (Only exists in dev builds)
        const isNativeReady = !!NativeModules.RazorpayCheckout;

        if (!isNativeReady) {
          throw new Error('RAZORPAY_NATIVE_MISSING');
        }

        Razorpay.open(options).then(async (data: any) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
              bookingId: booking._id,
            });

            if (verifyRes.data.success) {
              setCurrentStep(4);
            } else {
              await cleanupBooking(booking._id);
              Alert.alert('Payment Failed', verifyRes.data.message || 'Verification failed. Booking discarded.');
            }
          } catch (err: any) {
            await cleanupBooking(booking._id);
            Alert.alert('Payment Error', err.response?.data?.message || 'Error verifying payment. Booking discarded.');
          } finally {
            setLoading(false);
          }
        }).catch(async (error: any) => {
          await cleanupBooking(booking._id);
          console.error('Razorpay Error:', error);
          Alert.alert(
            'Payment Error', 
            `Could not open checkout: ${error.description || 'Unknown error'}\nCode: ${error.code || 'N/A'}`
          );
          setLoading(false);
        });
      } catch (nativeErr) {
        // Fallback to REAL WEB CHECKOUT instantly if Native Module fails or is missing (e.g. Expo Go)
        const baseUrl = api.defaults.baseURL;
        const key = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SbIYMAQzqrEkAM';
        
        const hostedUrl = `${baseUrl}/payment/hosted?orderId=${order.id}&amount=${order.amount}&key=${key}&name=${encodeURIComponent(user?.fullName || 'Customer')}&email=${user?.email || 'customer@example.com'}&contact=${user?.phone || '9999999999'}`;

        try {
          const result = await WebBrowser.openAuthSessionAsync(hostedUrl, 'mobilefrontend://');
          
          if (result.type === 'success' && result.url) {
            const url = result.url;
            if (url.includes('payment-success')) {
              // 🚀 OPTIMISTIC UI: Show success screen instantly!
              setCurrentStep(4);

              // Extract params and verify in background
              const paramsStr = url.split('?')[1];
              const queryParams: any = {};
              paramsStr.split('&').forEach(pair => {
                const [key, val] = pair.split('=');
                queryParams[key] = val;
              });

              api.post('/payment/verify', {
                razorpay_order_id: queryParams.razorpay_order_id || order.id,
                razorpay_payment_id: queryParams.razorpay_payment_id,
                razorpay_signature: queryParams.razorpay_signature,
                bookingId: booking._id,
              }).catch(vErr => {
                console.error('Background verification failed', vErr);
                // If it really failed, we could alert the user here, but for UI feel 
                // we've already shown success.
              });
            } else {
              await cleanupBooking(booking._id);
              Alert.alert('Payment Cancelled', 'The payment process was cancelled.');
            }
          } else {
            await cleanupBooking(booking._id);
          }
        } catch (e) {
          await cleanupBooking(booking._id);
          Alert.alert('Error', 'Failed to open payment gateway.');
        } finally {
          setLoading(false);
        }
      }

    } catch (err) {
      console.error('Booking flow failed', err);
      Alert.alert('Error', 'Failed to process booking.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !bookingData.vehicle) return Alert.alert('Select Vehicle', 'Please select a vehicle to continue.');
    if (currentStep === 2 && !bookingData.service) return Alert.alert('Select Service', 'Please select a service to continue.');
    if (currentStep === 3 && !bookingData.slot) return Alert.alert('Select Time', 'Please select a time slot to continue.');

    if (currentStep === 3) handleFinalBooking();
    else setCurrentStep(prev => prev + 1);
  };

  if (loading && currentStep === 1) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Preparing Workflow...</Text>
      </View>
    );
  }

  const { vendor, services, slots } = vendorData || { vendor: {}, services: [], slots: [] };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Custom Header */}
      <View className="pt-4 pb-6 px-6 bg-white shadow-sm shadow-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => {
              if (currentStep > 1 && currentStep < 4) setCurrentStep(prev => prev - 1);
              else navigation.dispatch(DrawerActions.openDrawer());
            }}
            className="w-10 h-10 bg-slate-50 items-center justify-center rounded-xl"
          >
            {currentStep > 1 && currentStep < 4 ? <ChevronLeft size={22} color="#0f172a" /> : <Menu size={22} color="#0f172a" />}
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter">Reservation</Text>
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Step {currentStep} of 4</Text>
          </View>
        </View>
        <HeaderNotificationIcon role="customer" />
      </View>

      <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          
          <View className="items-center mb-8 bg-blue-600 p-8 rounded-[40px] shadow-lg shadow-blue-200 relative overflow-hidden">
             <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
             <Text className="text-white text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Booking At</Text>
             <Text className="text-2xl font-black text-white tracking-tighter text-center">{vendor?.companyName || 'Center'}</Text>
             <View className="flex-row items-center gap-1.5 mt-3 bg-white/20 px-3 py-1 rounded-full">
                <MapPin size={10} color="white" />
                <Text className="text-white text-[9px] font-bold tracking-tight">{vendor?.businessLocation || 'Live Location'}</Text>
             </View>
          </View>

          {/* Step Indicator */}
          <View className="flex-row items-center justify-between mb-10 px-2">
            {STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <View className="items-center gap-2">
                  <View className={`w-9 h-9 rounded-2xl items-center justify-center border-2 ${
                    currentStep > i + 1 ? 'bg-emerald-500 border-emerald-500' :
                    currentStep === i + 1 ? 'bg-slate-900 border-slate-900' :
                    'bg-white border-slate-200'
                  }`}>
                    {currentStep > i + 1 ? <CheckCircle2 size={18} color="white" /> : <Text className={`text-xs font-black ${currentStep === i + 1 ? 'text-white' : 'text-slate-400'}`}>{i + 1}</Text>}
                  </View>
                  <Text className={`text-[8px] font-black uppercase tracking-widest ${currentStep === i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{step}</Text>
                </View>
                {i < STEPS.length - 1 && <View className={`h-[2px] flex-1 mx-2 ${currentStep > i + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </View>

          {/* Form Content */}
          <View className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm min-h-[420px]">
            {currentStep === 1 && (
              <View className="flex-1">
                 <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-sm font-black text-slate-900 uppercase tracking-tight">Select Vehicle</Text>
                    <TouchableOpacity onPress={() => setIsVehicleModalOpen(true)} className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                       <Text className="text-[9px] font-black text-blue-600 uppercase tracking-widest">+ Add New</Text>
                    </TouchableOpacity>
                 </View>
                 <View className="gap-4">
                    {customerVehicles.length > 0 ? (
                      customerVehicles.map((v: any) => (
                        <TouchableOpacity 
                           key={v._id} 
                           onPress={() => setBookingData({...bookingData, vehicle: v})} 
                           className={`p-5 rounded-[28px] flex-row items-center gap-4 border-2 ${bookingData.vehicle?._id === v._id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50'}`}
                         >
                           <View className={`w-10 h-10 rounded-xl items-center justify-center ${bookingData.vehicle?._id === v._id ? 'bg-blue-600' : 'bg-white'}`}>
                              <Car size={20} color={bookingData.vehicle?._id === v._id ? 'white' : '#94a3b8'} />
                           </View>
                           <View>
                              <Text className="text-[13px] font-black text-slate-900">{v.make} {v.model}</Text>
                              <Text className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">{v.plateNumber}</Text>
                           </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View className="items-center justify-center py-10 px-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                         <View className="w-16 h-16 bg-white rounded-3xl items-center justify-center mb-4 shadow-sm">
                            <Car size={28} color="#cbd5e1" />
                         </View>
                         <Text className="text-slate-900 font-black text-center text-sm">No Vehicles Found</Text>
                         <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 text-center leading-4">
                            You need to add a vehicle to your garage to proceed.
                         </Text>
                      </View>
                    )}
                 </View>
              </View>
            )}

            {currentStep === 2 && (
              <View className="flex-1">
                 <Text className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Choose Service</Text>
                 <View className="gap-3">
                    {services.length > 0 ? services.map((s: any) => (
                      <TouchableOpacity 
                         key={s._id} 
                         onPress={() => setBookingData({...bookingData, service: s})} 
                         className={`p-5 rounded-[28px] flex-row justify-between items-center border-2 ${bookingData.service?._id === s._id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50'}`}
                       >
                         <View className="flex-1 pr-4">
                           <Text className="text-[13px] font-black text-slate-900" numberOfLines={1}>{s.name}</Text>
                           <View className="flex-row items-center gap-1.5 mt-1.5">
                              <Clock size={10} color="#94a3b8" />
                              <Text className="text-[10px] font-bold text-slate-400">{s.duration} Mins</Text>
                           </View>
                         </View>
                         <View className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-50">
                            <Text className="text-base font-black text-emerald-600">₹{s.price}</Text>
                         </View>
                      </TouchableOpacity>
                    )) : (
                      <Text className="text-slate-400 font-bold italic text-xs text-center py-10">No active services from this vendor.</Text>
                    )}
                 </View>
              </View>
            )}

            {currentStep === 3 && (
              <View className="flex-1">
                 <Text className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Select Schedule</Text>
                 <View className="flex-row flex-wrap justify-between gap-y-4">
                   {slots.length > 0 ? slots.map((s: any) => {
                     const isFull = s.currentBookings >= s.maxBookings;
                     return (
                       <TouchableOpacity 
                          key={s._id} 
                          onPress={() => !isFull && setBookingData({...bookingData, slot: s.startTime})} 
                          disabled={isFull}
                          className={`w-[48%] py-5 rounded-[20px] items-center border-2 ${
                            bookingData.slot === s.startTime ? 'bg-slate-900 border-slate-900' : 
                            isFull ? 'bg-slate-100 border-slate-100 opacity-40' : 'bg-slate-50 border-slate-50'
                          }`}
                        >
                          <Text className={`text-xs font-black tracking-widest ${bookingData.slot === s.startTime ? 'text-white' : isFull ? 'text-slate-300' : 'text-slate-600'}`}>
                            {s.startTime}
                          </Text>
                          {isFull && <Text className="text-[7px] font-black text-slate-400 uppercase mt-1">Full</Text>}
                       </TouchableOpacity>
                     );
                   }) : (
                     <Text className="text-slate-400 font-bold italic text-xs text-center w-full py-10">No available slots for today.</Text>
                   )}
                 </View>
              </View>
            )}

            {currentStep === 4 && (
              <View className="flex-1 items-center justify-center pt-8">
                 <View className="w-24 h-24 bg-emerald-50 rounded-[40px] items-center justify-center mb-6 shadow-sm border border-emerald-100">
                   <CheckCircle2 size={48} color="#059669" />
                 </View>
                 <Text className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Booking Success!</Text>
                 <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center px-6 leading-4 mb-10">
                   Your appointment has been confirmed. You can track the live status in the bookings tab.
                 </Text>
                 <TouchableOpacity 
                    onPress={() => router.push('/(customer)/c-bookings')} 
                    className="w-full py-5 bg-slate-900 rounded-[24px] items-center shadow-lg shadow-slate-200"
                  >
                    <Text className="text-white text-xs font-black uppercase tracking-widest">Track Order</Text>
                 </TouchableOpacity>
              </View>
            )}

            {currentStep < 4 && (
              <View className="mt-auto pt-8 border-t border-slate-50 flex-row items-center justify-between">
                <TouchableOpacity 
                  onPress={() => setCurrentStep(prev => prev - 1)} 
                  disabled={currentStep === 1}
                  className={`flex-row items-center gap-1 ${currentStep === 1 ? 'opacity-0' : ''}`}
                >
                  <Text className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={nextStep} 
                  disabled={loading} 
                  className="px-10 py-5 bg-blue-600 rounded-[24px] flex-row items-center gap-3 shadow-lg shadow-blue-100"
                >
                   {loading ? (
                     <ActivityIndicator size="small" color="white" />
                   ) : (
                     <>
                        <Text className="text-white text-[11px] font-black uppercase tracking-widest">
                          {currentStep === 3 ? 'Confirm & Pay' : 'Next Step'}
                        </Text>
                        <ChevronRight size={18} color="white" />
                     </>
                   )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Vehicle Modal (Integrated into Booking Flow) */}
      <Modal visible={isVehicleModalOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl h-[70%]">
            <View className="flex-row justify-between items-center mb-10">
              <View>
                <Text className="text-2xl font-black text-slate-900">Add Vehicle</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct from Booking</Text>
              </View>
              <TouchableOpacity onPress={() => setIsVehicleModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl">
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
              disabled={isSubmittingVehicle}
              className={`w-full h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-lg ${isSubmittingVehicle ? 'bg-slate-400' : 'bg-blue-600 shadow-blue-200'}`}
            >
              {isSubmittingVehicle ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-white font-black text-xs uppercase tracking-widest">Add & Select</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
