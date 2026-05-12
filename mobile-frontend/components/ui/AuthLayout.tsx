import React from 'react';
import { View, Text, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { WashingMachine, ArrowLeft } from 'lucide-react-native';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: 'center',
            paddingVertical: 20 // Reduced from 40 for better fit on desktop
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[340px] mx-auto px-2">
            {/* Extremely Compact Header to fit everything on screen */}
            <View className="items-center mb-3">
              <View className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-md mb-1.5">
                <WashingMachine size={16} color="#fff" />
              </View>
              <Text className="text-lg font-inter-bold text-slate-900 tracking-tight text-center">{title}</Text>
              {subtitle && <Text className="text-[9px] text-slate-400 mt-0.5 font-inter-medium text-center">{subtitle}</Text>}
            </View>

            {/* Main Form Content */}
            {children}

            {/* Compact Back Link - Moved closer to the form */}
            <Pressable 
              onPress={() => router.push('/')}
              className="flex-row items-center justify-center gap-1.5 mt-4 opacity-60 active:opacity-100 py-1"
            >
              <ArrowLeft size={12} color="#64748b" />
              <Text className="text-[10px] font-inter-bold text-slate-500 uppercase tracking-widest">Back to Home</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
