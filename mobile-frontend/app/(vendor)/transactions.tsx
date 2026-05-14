import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Download } from 'lucide-react-native';

const TRANSACTIONS = [
  { id: 'TX-7K9W2M4P1L', cust: 'John Doe', amt: '+₹85', date: 'May 12, 2026', time: '10:30 AM', status: 'Success' },
  { id: 'TX-3B8V5N9Q0X', cust: 'Sarah Smith', amt: '+₹35', date: 'May 11, 2026', time: '02:15 PM', status: 'Success' },
  { id: 'TX-1M4L7P2D8G', cust: 'Mike Ross', amt: '-₹15', date: 'May 10, 2026', time: '09:00 AM', status: 'Refund' },
  { id: 'TX-9R3T6Y1H5J', cust: 'Harvey Specter', amt: '+₹120', date: 'May 09, 2026', time: '11:45 AM', status: 'Success' },
];

export default function VendorTransactions() {
  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Finances</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Comprehensive payment logs</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-sm">
            <Download size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View className="pb-10">
          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <View className="bg-blue-50 px-2.5 py-1.5 rounded-lg">
                  <Text className="text-[10px] font-bold text-blue-600 font-mono tracking-tighter uppercase">{tx.id}</Text>
                </View>
                <View className={`px-2.5 py-1.5 rounded-lg ${tx.status === 'Success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <Text className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'Success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</Text>
                  <Text className="text-sm font-bold text-slate-900 mb-3">{tx.cust}</Text>

                  <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs font-bold text-slate-600">{tx.date}</Text>
                    <View className="w-1 h-1 bg-slate-300 rounded-full" />
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{tx.time}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</Text>
                  <Text className={`text-xl font-bold ${tx.amt.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.amt}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
