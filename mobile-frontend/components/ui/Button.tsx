import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return 'bg-slate-100';
      case 'danger': return 'bg-red-500';
      case 'outline': return 'bg-transparent border border-slate-200';
      default: return 'bg-slate-900';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary': return 'text-slate-900';
      case 'outline': return 'text-slate-600';
      default: return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`h-14 rounded-2xl flex-row items-center justify-center px-6 ${getVariantStyles()} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text className={`text-base font-semibold tracking-tight ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
