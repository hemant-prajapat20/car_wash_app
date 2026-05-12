import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader = ({ message = 'Loading...', fullScreen = false }: LoaderProps) => {
  return (
    <View className={`items-center justify-center ${fullScreen ? 'flex-1 bg-white/80 absolute inset-0 z-50' : 'p-4'}`}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      {message && (
        <Text className="mt-4 text-slate-500 font-semibold text-sm tracking-wide">
          {message}
        </Text>
      )}
    </View>
  );
};
