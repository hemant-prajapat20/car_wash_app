import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Badge } from 'react-native';
import { Search, Filter, AlertCircle, MessageSquare, User, Store, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const complaints = [
    { id: 'CMP-001', type: 'Customer', subject: 'Late Service', target: 'Aqua Shine Pro', status: 'Pending', date: '2024-05-08', priority: 'High' },
    { id: 'CMP-002', type: 'Vendor', subject: 'Payment Discrepancy', target: 'System', status: 'Resolved', date: '2024-05-07', priority: 'Medium' },
    { id: 'CMP-003', type: 'Customer', subject: 'Poor Wash Quality', target: 'Crystal Clean', status: 'In Review', date: '2024-05-07', priority: 'High' },
    { id: 'CMP-004', type: 'Customer', subject: 'Cancellation Fee', target: 'Eco Wash', status: 'Pending', date: '2024-05-06', priority: 'Low' },
  ];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Complaints & Support</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Resolution center for platform disputes</Text>
      </View>

      <View className="flex-row mb-6 bg-slate-50 p-1 rounded-xl self-start border border-slate-100">
        {['All', 'Pending', 'Resolved', 'In Review'].map((tab) => (
          <Pressable 
            key={tab}
            onPress={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-1.5 rounded-lg ${activeTab === tab.toLowerCase() ? 'bg-primary-600' : ''}`}
          >
            <Text className={`text-[11px] font-inter-bold uppercase tracking-wider ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-slate-500'}`}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="space-y-4">
        {complaints.map((complaint) => (
          <Pressable key={complaint.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm active:scale-[0.99] transition-all">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center gap-3">
                <View className={`p-2 rounded-xl ${complaint.priority === 'High' ? 'bg-red-500/10' : 'bg-slate-50'}`}>
                   <AlertCircle size={16} color={complaint.priority === 'High' ? '#ef4444' : '#94a3b8'} />
                </View>
                <View>
                  <Text className="text-slate-900 font-inter-bold text-sm">{complaint.subject}</Text>
                  <Text className="text-slate-500 text-[10px] uppercase font-inter-bold tracking-widest mt-0.5">{complaint.id} • {complaint.date}</Text>
                </View>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                complaint.status === 'Resolved' ? 'bg-emerald-500/10' : 
                complaint.status === 'Pending' ? 'bg-red-500/10' : 'bg-amber-500/10'
              }`}>
                <Text className={`text-[9px] font-inter-bold uppercase ${
                  complaint.status === 'Resolved' ? 'text-emerald-500' : 
                  complaint.status === 'Pending' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {complaint.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-4 border-t border-slate-800/50">
               <View className="flex-row items-center gap-6">
                 <View className="flex-row items-center gap-2">
                    <User size={12} color="#475569" />
                    <Text className="text-slate-400 text-xs">{complaint.type}</Text>
                 </View>
                 <View className="flex-row items-center gap-2">
                    <Store size={12} color="#475569" />
                    <Text className="text-slate-400 text-xs">{complaint.target}</Text>
                 </View>
               </View>
               
               <View className="flex-row items-center gap-3">
                  {complaint.status !== 'Resolved' && (
                    <Pressable className="w-8 h-8 bg-emerald-500/10 rounded-lg items-center justify-center border border-emerald-500/20">
                      <CheckCircle size={14} color="#10b981" />
                    </Pressable>
                  )}
                  <Pressable className="w-8 h-8 bg-slate-800 rounded-lg items-center justify-center border border-slate-700">
                    <ChevronRight size={14} color="#94a3b8" />
                  </Pressable>
               </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="mt-10 p-6 bg-slate-50 border border-slate-100 rounded-3xl items-center">
         <View className="w-12 h-12 bg-primary-600/10 rounded-full items-center justify-center mb-4">
            <MessageSquare size={24} color="#0ea5e9" />
         </View>
         <Text className="text-slate-900 font-inter-bold text-base mb-2">Need to contact a Vendor?</Text>
         <Text className="text-slate-500 text-xs text-center leading-relaxed mb-6">
           Direct communication with vendors is restricted for platform safety. Use the mediation tool to resolve disputes.
         </Text>
         <Pressable className="bg-primary-600 px-6 py-2.5 rounded-xl">
            <Text className="text-white font-inter-bold text-xs uppercase tracking-widest">Open Resolution Center</Text>
         </Pressable>
      </View>
    </ScrollView>
  );
}
