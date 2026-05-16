import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Share, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Printer, Share2, CheckCircle2, 
  MapPin, Phone, Mail, Waves, ShieldCheck,
  ArrowLeft, AlertCircle, ChevronLeft
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function InvoiceScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBackPath = () => {
    if (!user) return '/';
    if (user.role === 'vendor') return '/(vendor)/dashboard';
    return '/(customer)/search';
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/payment/invoice/${bookingId}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError('Failed to load invoice');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching invoice');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchInvoice();
  }, [bookingId]);

  const handleShare = async () => {
    try {
      const message = `Chakaachak Invoice: ${data.invoiceNo}\nTotal: ₹${data.grandTotal}\nService: ${data.service?.name}`;
      await Share.share({
        message,
        title: `Invoice ${data.invoiceNo}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return (
    <View className="flex-1 bg-slate-50 items-center justify-center">
      <ActivityIndicator size="large" color="#2563eb" />
      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Authenticating Receipt...</Text>
    </View>
  );

  if (error || !data) return (
    <View className="flex-1 bg-slate-50 items-center justify-center p-6 text-center">
      <View className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full items-center justify-center mb-4">
        <AlertCircle size={32} color="#ef4444" />
      </View>
      <Text className="text-xl font-bold text-slate-900 mb-2">Invoice Not Found</Text>
      <Text className="text-sm text-slate-500 mb-6 text-center">{error || 'The requested invoice could not be retrieved.'}</Text>
      <TouchableOpacity 
        onPress={() => router.back()}
        className="px-8 py-3 bg-slate-900 rounded-xl"
      >
        <Text className="text-white text-xs font-bold uppercase tracking-widest">Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        {/* Navigation Header */}
        <View className="px-4 py-4 flex-row items-center justify-between border-b border-slate-100 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={20} color="#94a3b8" />
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="bg-blue-50 p-2 rounded-lg">
            <Share2 size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="p-4">
            <View className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              {/* Branded Header */}
              <View className="bg-blue-600 p-8 items-center">
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/30 mb-4">
                  <Waves size={24} color="white" />
                </View>
                <Text className="text-2xl font-black text-white tracking-tighter">CHAKAACHAK</Text>
                <Text className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] mt-1">Premium Auto Care</Text>
                
                <View className="mt-8 items-center bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                  <Text className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Invoice Amount</Text>
                  <Text className="text-4xl font-black text-white">₹{data.grandTotal}</Text>
                </View>
              </View>

              <View className="p-6">
                {/* Meta Info */}
                <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-slate-50">
                  <View>
                    <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Invoice No</Text>
                    <Text className="text-[13px] font-black text-slate-900 tracking-tighter">{data.invoiceNo}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</Text>
                    <Text className="text-[12px] font-bold text-slate-700">{new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                  </View>
                </View>

                {/* Billing Grid */}
                <View className="space-y-4 mb-8">
                  <View className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <Text className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Customer</Text>
                    <Text className="text-base font-black text-slate-900 mb-1">{data.customer?.fullName}</Text>
                    <View className="flex-row items-center">
                      <Phone size={12} color="#3b82f6" />
                      <Text className="text-[11px] font-bold text-slate-500 ml-2">{data.customer?.phone}</Text>
                    </View>
                  </View>

                  <View className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <Text className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Service Center</Text>
                    <Text className="text-base font-black text-slate-900 mb-1">{data.vendor?.companyName}</Text>
                    <View className="flex-row items-start">
                      <MapPin size={12} color="#94a3b8" />
                      <Text className="text-[11px] font-bold text-slate-500 ml-2 flex-1 leading-4">{data.vendor?.businessLocation}</Text>
                    </View>
                  </View>
                </View>

                {/* Service Items */}
                <View className="mb-8">
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Service Breakdown</Text>
                  <View className="border border-slate-100 rounded-2xl overflow-hidden">
                    <View className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex-row justify-between">
                      <Text className="text-[9px] font-black text-slate-400 uppercase">Item</Text>
                      <Text className="text-[9px] font-black text-slate-400 uppercase">Total</Text>
                    </View>
                    <View className="p-4 flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-[14px] font-black text-slate-900 uppercase tracking-tighter">{data.service?.name}</Text>
                        <Text className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Maintenance Services (9987)</Text>
                      </View>
                      <Text className="text-base font-black text-slate-900">₹{data.taxableAmount}</Text>
                    </View>
                  </View>
                </View>

                {/* Totals Card */}
                <View className="bg-slate-900 p-6 rounded-[24px] space-y-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Subtotal (Net)</Text>
                    <Text className="text-[10px] font-bold text-white tracking-widest">₹{data.taxableAmount}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">GST Total (18%)</Text>
                    <Text className="text-[10px] font-bold text-blue-400 tracking-widest">₹{(data.cgst + data.sgst).toFixed(2)}</Text>
                  </View>
                  <View className="h-[1px] bg-white/10 my-1" />
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs font-black text-white/50 uppercase tracking-widest">Total</Text>
                    <Text className="text-2xl font-black text-white tracking-tighter">₹{data.grandTotal}</Text>
                  </View>
                </View>

                {/* Verification Footer */}
                <View className="mt-8 pt-6 border-t border-slate-50 flex-row items-center justify-center space-x-2">
                   <ShieldCheck size={16} color="#10b981" />
                   <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">E-Invoice Verified • Chakaachak Secure</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
