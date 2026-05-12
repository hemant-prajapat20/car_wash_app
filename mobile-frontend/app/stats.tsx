import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import LandingNavbar from '../components/sidebar/LandingNavbar';

export default function InfoPage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <LandingNavbar />
      <ScrollView className="flex-1">
        <View className="py-20 px-6 items-center">
          <View className="w-20 h-20 bg-primary-50 rounded-3xl items-center justify-center mb-6">
             <Text className="text-4xl">🚀</Text>
          </View>
          <Text className="text-3xl font-inter-bold text-slate-900 text-center">Module Under Construction</Text>
          <Text className="text-lg text-slate-500 font-inter-medium mt-4 text-center max-w-md">
            We are currently building this section to provide you with the best car wash management experience. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
