import React from 'react';
import { View, Text } from 'react-native';

export default function ComplaintsPage() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-slate-900 font-inter-bold text-lg">Complaints & Disputes</Text>
      <Text className="text-slate-500 text-sm mt-2 text-center">Manage and resolve customer service issues.</Text>
    </View>
  );
}
