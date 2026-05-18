import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '../../store';
import { register, clearError } from '../../store/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { UserPlus, ArrowLeft } from 'lucide-react-native';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.fullName) return;
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      // Auto-redirection handled by RootLayout
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (error) dispatch(clearError());
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
          {/* Header */}
          <View className="mb-10">
            <TouchableOpacity 
              onPress={() => router.replace('/')} 
              className="flex-row items-center gap-2 mb-8 bg-blue-50 self-start px-3 py-2 rounded-xl"
            >
              <ArrowLeft size={14} color="#2563eb" />
              <Text className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Return to Home</Text>
            </TouchableOpacity>

            <View className="w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <UserPlus color="white" size={24} />
            </View>
            <Text className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</Text>
            <Text className="text-slate-500 text-base mt-2">Join the Chakachak network today</Text>
          </View>

          {error && (
            <View className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
              <Text className="text-red-600 text-xs font-bold uppercase tracking-widest">{error}</Text>
            </View>
          )}

          <View className="space-y-1">
            <Input 
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChangeText={(text) => updateForm('fullName', text)}
            />
            
            <Input 
              label="Email Address"
              placeholder="john@example.com"
              value={formData.email}
              onChangeText={(text) => updateForm('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input 
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChangeText={(text) => updateForm('phone', text)}
              keyboardType="phone-pad"
            />
            
            <Input 
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => updateForm('password', text)}
              secureTextEntry
            />

            <View className="flex-row items-center flex-wrap mb-6 px-1">
              <Text className="text-slate-400 text-[10px] font-medium leading-4">
                By signing up, you agree to our{' '}
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 text-[10px] font-bold">Terms of Service</Text>
              </TouchableOpacity>
              <Text className="text-slate-400 text-[10px] font-medium leading-4"> and </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 text-[10px] font-bold">Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <Button 
              title="Create My Account"
              onPress={handleSignup}
              isLoading={isLoading}
              className="shadow-lg shadow-blue-100 bg-blue-600"
            />
          </View>

          <View className="mt-auto items-center flex-row justify-center pt-10">
            <Text className="text-slate-400 text-sm font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-slate-900 text-sm font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
