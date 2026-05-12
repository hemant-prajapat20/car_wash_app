import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function PlaceholderScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-xl font-bold text-slate-900">Coming Soon</Text>
      <Text className="text-sm text-slate-500 mt-2 text-center">This feature is currently under development.</Text>
    </View>
  );
}
