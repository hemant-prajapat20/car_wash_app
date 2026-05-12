import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge = ({ label, variant = 'info', className }: BadgeProps) => {
  const variants = {
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
  };

  const textVariants = {
    success: 'text-green-700',
    warning: 'text-amber-700',
    error: 'text-red-700',
    info: 'text-blue-700',
  };

  return (
    <View className={`px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      <Text className={`text-[10px] font-inter-semibold uppercase tracking-wider ${textVariants[variant]}`}>
        {label}
      </Text>
    </View>
  );
};
