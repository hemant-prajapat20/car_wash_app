import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle = '',
  ...props
}) => {
  return (
    <View className={`w-full mb-4 ${containerStyle}`}>
      {label && (
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
          {label}
        </Text>
      )}
      <View className={`h-14 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-4 flex-row items-center`}>
        <TextInput
          className="flex-1 text-slate-900 text-sm font-medium h-full"
          placeholderTextColor="#94a3b8"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">
          {error}
        </Text>
      )}
    </View>
  );
};
