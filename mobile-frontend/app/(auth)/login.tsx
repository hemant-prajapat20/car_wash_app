import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) return;
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      // Navigation is handled by RootLayout's useEffect based on role
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-8 pt-20 pb-10">
          {/* Brand Logo */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 bg-slate-900 rounded-3xl items-center justify-center shadow-xl shadow-slate-200">
              <ShieldCheck color="white" size={32} />
            </View>
            <Text className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">Chakachak</Text>
            <Text className="text-slate-400 text-sm font-medium mt-1">SaaS Car Wash Solutions</Text>
          </View>

          <View className="mb-10">
            <TouchableOpacity 
              onPress={() => router.replace('/')} 
              className="flex-row items-center gap-2 mb-8 bg-blue-50 self-start px-3 py-2 rounded-xl"
            >
              <ArrowLeft size={14} color="#2563eb" />
              <Text className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Return to Home</Text>
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</Text>
            <Text className="text-slate-500 text-base mt-2">Sign in to manage your bookings and services</Text>
          </View>

          {error && (
            <View className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
              <Text className="text-red-600 text-xs font-bold uppercase tracking-widest">{error}</Text>
            </View>
          )}

          <View className="space-y-4">
            <Input 
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) dispatch(clearError());
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <Input 
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) dispatch(clearError());
              }}
              secureTextEntry
            />

            <TouchableOpacity className="items-end mb-6">
              <Text className="text-blue-600 text-xs font-bold uppercase tracking-widest">Forgot Password?</Text>
            </TouchableOpacity>

            <Button 
              title="Sign In Account"
              onPress={handleLogin}
              isLoading={isLoading}
              className="mt-4 shadow-lg shadow-slate-200"
            />
          </View>

          <View className="mt-auto items-center flex-row justify-center pt-10">
            <Text className="text-slate-400 text-sm font-medium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-slate-900 text-sm font-bold">Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
