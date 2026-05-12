import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
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

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
    }
  });

  const onSignup = async (data: SignupFormData) => {
    try {
      setLoading(true);
      const response = await authService.signup(data);
      
      if (response.success) {
        dispatch(setCredentials({ 
          user: response.data.user, 
          token: response.data.token 
        }));
        router.replace('/customer/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join AquaWash today"
    >
      <Card className="p-4 shadow-sm border-slate-100">
        <View className="space-y-4">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="FULL NAME" 
                placeholder="John Doe"
                value={value}
                onChangeText={onChange}
                error={errors.fullName?.message}
              />
            )}
          />

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
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="PHONE NUMBER" 
                placeholder="10 digit mobile number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={errors.phoneNumber?.message}
                maxLength={10}
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

          <Button 
            className="w-full h-11 mt-2 shadow-sm" 
            onPress={handleSubmit(onSignup)}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-inter-bold">Create Account</Text>}
          </Button>
        </View>

        <View className="flex-row items-center justify-center mt-5 gap-1.5">
          <Text className="text-[11px] text-slate-500 font-inter-medium">Already have an account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text className="text-[11px] font-inter-semibold text-primary-600 uppercase">Sign In</Text>
          </Pressable>
        </View>
      </Card>
    </AuthLayout>
  );
}
