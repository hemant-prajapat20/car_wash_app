import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: any;
  className?: string;
}

export const Input = ({ label, error, helpText, icon: Icon, className = '', ...props }: InputProps) => {
  return (
    <View className={`w-full space-y-1 ${className}`}>
      {label && (
        <Text className="text-[11px] font-inter-semibold text-slate-400 ml-1 uppercase tracking-widest mb-1">
          {label}
        </Text>
      )}
      <View className="relative">
        {Icon && (
          <View className="absolute left-3 top-[12px] z-10">
            {typeof Icon === 'function' || (typeof Icon === 'object' && Icon.$$typeof) ? (
              React.isValidElement(Icon) ? Icon : <Icon size={16} color="#64748b" />
            ) : (
              Icon
            )}
          </View>
        )}
        <TextInput
          className={`w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-primary-500 transition-all ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
          placeholderTextColor="#94a3b8"
          {...props}
        />
      </View>
      {helpText && !error && (
        <Text className="text-[10px] font-inter-medium text-slate-500 ml-1 mt-1 italic uppercase tracking-wider">
          {helpText}
        </Text>
      )}
      {error && (
        <Text className="text-[10px] font-inter-medium text-red-500 ml-1 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};
