import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AuthLayout } from '../components/ui/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/authService';
import { setCredentials } from '../store/authSlice';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react-native';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);

  const onAdminLogin = async () => {
    if (!secretKey) {
      Alert.alert('Required', 'Please enter the Secret Admin Key to proceed.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.adminLogin(secretKey);

      if (response.success) {
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
        router.replace('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unauthorized. Invalid Secret Key.';
      Alert.alert('Access Denied', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Secure Admin Access"
      subtitle="SuperAdmin Authorization Only"
    >


      <Card className="p-5 shadow-xl border-slate-100 bg-white rounded-[24px]">
        <View className="mb-6">
          <Text className="text-slate-500 font-inter-semibold text-[9px] uppercase tracking-[3px] text-center mb-1">Identity Verification</Text>
          <View className="items-center mb-5 ">
            <View className="w-11 h-10 bg-slate-50 rounded-xl items-center justify-center shadow-md border border-slate-100 mb-2">
              <ShieldCheck size={24} color="#0ea5e9" strokeWidth={2.5} />
            </View>
          </View>
          <Text className="text-slate-900 font-inter-bold text-center text-base tracking-tight ">Enter Access Credentials</Text>
        </View>

        <View className="space-y-4">
          <Input
            placeholder="••••••••••••••••"
            secureTextEntry
            icon={Lock}
            value={secretKey}
            onChangeText={setSecretKey}
            helpText="Admin Secret Access Key"
            className="bg-slate-50 border-slate-200 text-slate-900"
            placeholderTextColor="#94a3b8"
          />

          <Button
            className="w-full h-12 mt-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-900"
            onPress={onAdminLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-inter-bold uppercase tracking-[2px] text-[11px]">Authorize Access</Text>
            )}
          </Button>
        </View>

        <View className="mt-6 pt-4 border-t border-slate-100 items-center">
          <Pressable
            onPress={() => router.replace('/login')}
            className="flex-row items-center gap-2 active:opacity-60 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
          >
            <ArrowLeft size={12} color="#64748b" />
            <Text className="text-slate-500 font-inter-semibold text-[9px] uppercase tracking-widest">Standard Portal</Text>
          </Pressable>
        </View>
      </Card>

      <View className="mt-8 items-center px-4">
        <Text className="text-slate-600 font-inter-medium text-[9px] text-center leading-relaxed">
          Security Protocol Alpha: All unauthorized access attempts are logged and reported.
        </Text>
      </View>
    </AuthLayout>
  );
}
