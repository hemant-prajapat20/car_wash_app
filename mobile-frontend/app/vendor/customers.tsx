import React from 'react';
import { View, Text } from 'react-native';

export default function CustomersPage() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-slate-900 font-inter-bold text-lg">My Customers</Text>
      <Text className="text-slate-500 text-sm mt-2 text-center">View and manage your loyal customer base.</Text>
    </View>
  );
}
