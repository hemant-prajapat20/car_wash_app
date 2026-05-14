import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Inbox, CreditCard, AlertCircle, Trash2 } from 'lucide-react-native';

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'New Booking Request', message: 'John Doe booked Premium Wash at 10:30 AM tomorrow.', time: '5m', type: 'booking', read: false },
  { id: '2', title: 'Payout Confirmed', message: 'Your payout of $1,250.00 is being processed.', time: '1h', type: 'payment', read: false },
  { id: '3', title: 'Urgent Alert', message: 'Slot availability is low for the weekend.', time: '3h', type: 'alert', read: true },
];

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const clearAll = () => setNotifications([]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    if (type === 'booking') return <Inbox size={18} color="#2563eb" />;
    if (type === 'payment') return <CreditCard size={18} color="#059669" />;
    return <AlertCircle size={18} color="#e11d48" />;
  };

  const getBgColor = (type: string) => {
    if (type === 'booking') return 'bg-blue-100';
    if (type === 'payment') return 'bg-emerald-100';
    return 'bg-rose-100';
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Activity Alerts</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stay updated</Text>
          </View>
          <TouchableOpacity onPress={clearAll}>
            <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Clear All</Text>
          </TouchableOpacity>
        </View>

        <View className="pb-10">
          {notifications.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm mt-4">
              <Inbox size={48} color="#cbd5e1" className="mb-4" />
              <Text className="text-slate-900 font-bold text-base mb-1">All Caught Up</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                You have no pending notifications at this time.
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <View 
                key={notif.id} 
                className={`p-4 rounded-2xl flex-row items-center gap-4 mb-3 border ${notif.read ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-100'}`}
              >
                <View className={`w-12 h-12 rounded-xl items-center justify-center ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </View>

                <View className="flex-1 pr-2">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-bold text-slate-900 leading-tight" numberOfLines={1}>{notif.title}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.time}</Text>
                  </View>
                  <Text className="text-xs text-slate-500 leading-relaxed" numberOfLines={2}>{notif.message}</Text>
                </View>

                <TouchableOpacity onPress={() => removeNotification(notif.id)} className="p-2 bg-slate-50 rounded-lg">
                  <Trash2 size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
