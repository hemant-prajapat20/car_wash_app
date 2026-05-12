import React from 'react';
import { View, Text } from 'react-native';

export default function RewardsPage() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-slate-900 font-inter-bold text-lg">Loyalty & Rewards</Text>
      <Text className="text-slate-500 text-sm mt-2 text-center">Configure rewards programs for your customers.</Text>
    </View>
  );
}
