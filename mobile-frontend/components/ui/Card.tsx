import React from 'react';
import { View, Text, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export const Card = ({ className = '', children, header, footer, noPadding = false, ...props }: CardProps) => {
  return (
    <View
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {header && (
        <View className="px-5 py-4 border-b border-slate-100">
          {typeof header === 'string' ? (
            <Text className="font-inter-semibold text-slate-800 text-base">{header}</Text>
          ) : (
            header
          )}
        </View>
      )}
      <View className={`${!noPadding ? 'p-5' : ''}`}>
        {children}
      </View>
      {footer && (
        <View className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          {typeof footer === 'string' ? (
            <Text className="text-slate-600 text-sm">{footer}</Text>
          ) : (
            footer
          )}
        </View>
      )}
    </View>
  );
};
