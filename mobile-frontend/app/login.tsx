import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { AuthLayout } from '../components/ui/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/authService';
import { setCredentials } from '../store/authSlice';
import { Eye, EyeOff } from 'lucide-react-native';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      
      if (response.success) {
        dispatch(setCredentials({ 
          user: response.data.user, 
          token: response.data.token 
        }));
        
        const role = response.data.user.role;
        router.replace(role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      const status = error.response?.status;

      if (status === 404) {
        // Specifically handle "Account Not Found" with a redirection option
        if (Platform.OS === 'web') {
          if (window.confirm(`${message}\n\nWould you like to create an account?`)) {
            router.push('/signup');
          }
        } else {
          Alert.alert(
            'Account Not Found',
            message,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Up', onPress: () => router.push('/signup') }
            ]
          );
        }
      } else {
        Alert.alert('Login Failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <Card className="p-4 shadow-sm border-slate-100">
        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="EMAIL ADDRESS" 
                placeholder="john@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View className="relative">
                <Input 
                  label="PASSWORD" 
                  placeholder="••••••••" 
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
                <Pressable 
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[32px]"
                >
                  {showPassword ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
                </Pressable>
              </View>
            )}
          />

          <Pressable 
            onPress={() => router.push('/forgot-password')}
            className="self-end -mt-1"
          >
            <Text className="text-[10px] font-inter-semibold text-primary-600 uppercase tracking-wider">Forgot Password?</Text>
          </Pressable>

          <Button 
            className="w-full h-11 mt-1 shadow-sm" 
            onPress={handleSubmit(onLogin)}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-inter-bold">Sign In</Text>}
          </Button>
        </View>

        <View className="flex-row items-center justify-center mt-5 gap-1.5">
          <Text className="text-[11px] text-slate-500 font-inter-medium">Don't have an account?</Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text className="text-[11px] font-inter-semibold text-primary-600 uppercase">Create Account</Text>
          </Pressable>
        </View>
      </Card>
    </AuthLayout>
  );
}
