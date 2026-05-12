import React from 'react';
import { View, Text } from 'react-native';

export default function SlotManagementPage() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-slate-900 font-inter-bold text-lg">Slot Management</Text>
      <Text className="text-slate-500 text-sm mt-2 text-center">Open or close booking slots based on your availability.</Text>
    </View>
  );
}
