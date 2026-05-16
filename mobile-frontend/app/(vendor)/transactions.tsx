import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { Download, Receipt, AlertCircle, Loader2, Menu, Printer } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { HeaderNotificationIcon } from '../../components/HeaderNotificationIcon';

export default function VendorTransactions() {
  const navigation = useNavigation();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/vendor/transactions');
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Ledger...</Text>
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
              <Text className="text-xl font-black text-slate-900 tracking-tighter">Finances</Text>
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payment Logs</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-lg shadow-slate-200">
              <Download size={18} color="white" />
            </TouchableOpacity>
            <HeaderNotificationIcon role="vendor" />
          </View>
        </View>

        <View className="px-6 pt-6 pb-20">
          {transactions.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <Receipt size={48} color="#cbd5e1" className="mb-4 opacity-50" />
              <Text className="text-slate-900 font-bold text-base mb-1">No Transactions</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8 leading-4">
                When customers pay, their history will appear here.
              </Text>
            </View>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-4">
                <View className="flex-row justify-between items-center mb-5">
                  <TouchableOpacity 
                    onPress={() => router.push(`/invoice/${tx.bookingId}`)}
                    className="bg-blue-50 px-3 py-1 rounded-xl flex-row items-center gap-2"
                  >
                    <Printer size={12} color="#2563eb" />
                    <Text className="text-[10px] font-black text-blue-600 font-mono tracking-tighter uppercase">{tx.id}</Text>
                  </TouchableOpacity>
                  <View className={`px-3 py-1 rounded-xl ${
                    tx.status === 'Success' ? 'bg-emerald-50' : 
                    tx.status === 'Refund' ? 'bg-amber-50' : 
                    'bg-rose-50'
                  }`}>
                    <Text className={`text-[9px] font-black uppercase tracking-widest ${
                      tx.status === 'Success' ? 'text-emerald-600' : 
                      tx.status === 'Refund' ? 'text-amber-600' : 
                      'text-rose-600'
                    }`}>
                      {tx.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-end pt-2">
                  <View className="flex-1">
                    <Text className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Customer</Text>
                    <Text className="text-sm font-black text-slate-900 mb-4">{tx.cust}</Text>

                    <Text className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Date & Time</Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs font-bold text-slate-500">{tx.date}</Text>
                      <View className="w-1 h-1 bg-slate-200 rounded-full" />
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{tx.time}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Amount</Text>
                    <Text className={`text-xl font-black ${tx.amt.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.amt}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
