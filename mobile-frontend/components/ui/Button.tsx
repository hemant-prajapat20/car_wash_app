import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className = '',
  textClassName = '',
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-slate-800 active:bg-slate-900',
    outline: 'border border-slate-200 bg-transparent active:bg-slate-50',
    ghost: 'bg-transparent active:bg-slate-100',
    danger: 'bg-red-600 active:bg-red-700',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-slate-700',
    ghost: 'text-slate-600',
    danger: 'text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-4',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      className={`flex-row items-center justify-center rounded-xl font-inter-semibold transition-all ${variants[variant]} ${sizes[size]} ${className} ${props.disabled || isLoading ? 'opacity-50' : ''}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#0ea5e9' : '#ffffff'} className="mr-2" />
      ) : null}
      {React.Children.map(children, child => {
        if (typeof child === 'string' || typeof child === 'number') {
          return (
            <Text className={`font-inter-semibold text-center ${textVariants[variant]} ${textSizes[size]} ${textClassName}`}>
              {child}
            </Text>
          );
        }
        return child;
      })}
    </Pressable>
  );
};
