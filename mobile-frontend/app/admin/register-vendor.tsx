import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { UserPlus, Shield, Store, Mail, Phone, Lock, MapPin, Building2, CheckCircle2 } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DashboardCard } from '../../components/admin/DashboardComponents';
import { adminService } from '../../services/authService';

export default function RegisterVendor() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    companyName: '',
    businessLocation: ''
  });

  const handleRegister = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.companyName) {
      Alert.alert('Required Fields', 'Please fill in all the essential details.');
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.registerVendor(formData);
      
      if (response.success) {
        Alert.alert(
          'Registration Successful', 
          `Vendor ${formData.companyName} has been registered successfully. A unique Vendor ID has been auto-generated.`,
          [{ text: 'OK', onPress: () => setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            companyName: '',
            businessLocation: ''
          }) }]
        );
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register vendor.';
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Register Vendor</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Onboard new partners to the platform</Text>
      </View>

      <View className="flex-row flex-wrap -m-3">
        {/* Left Column: Form */}
        <View className="p-3 w-full lg:w-2/3">
          <DashboardCard>
            <View className="space-y-6">
              <View>
                <Text className="text-slate-900 font-inter-bold text-sm mb-4">Personal Information</Text>
                <View className="flex-row flex-wrap -mx-2">
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Full Name" 
                      placeholder="e.g. John Doe" 
                      icon={UserPlus} 
                      value={formData.fullName}
                      onChangeText={(val) => setFormData({...formData, fullName: val})}
                    />
                  </View>
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Email Address" 
                      placeholder="vendor@email.com" 
                      icon={Mail} 
                      keyboardType="email-address"
                      value={formData.email}
                      onChangeText={(val) => setFormData({...formData, email: val})}
                    />
                  </View>
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Phone Number" 
                      placeholder="+1 (555) 000-0000" 
                      icon={Phone} 
                      keyboardType="phone-pad"
                      value={formData.phoneNumber}
                      onChangeText={(val) => setFormData({...formData, phoneNumber: val})}
                    />
                  </View>
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Access Password" 
                      placeholder="••••••••" 
                      icon={Lock} 
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(val) => setFormData({...formData, password: val})}
                    />
                  </View>
                </View>
              </View>

              <View className="pt-4 border-t border-slate-800/50">
                <Text className="text-slate-900 font-inter-bold text-sm mb-4">Business Details</Text>
                <View className="flex-row flex-wrap -mx-2">
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Company Name" 
                      placeholder="e.g. Aqua Shine Pro" 
                      icon={Building2} 
                      value={formData.companyName}
                      onChangeText={(val) => setFormData({...formData, companyName: val})}
                    />
                  </View>
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <Input 
                      label="Business Location" 
                      placeholder="City, Country" 
                      icon={MapPin} 
                      value={formData.businessLocation}
                      onChangeText={(val) => setFormData({...formData, businessLocation: val})}
                    />
                  </View>
                </View>
              </View>

              <Button 
                className="w-full h-14 bg-primary-600 rounded-2xl shadow-xl shadow-primary-900 mt-4" 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View className="flex-row items-center justify-center gap-2">
                    <Text className="text-white font-inter-bold uppercase tracking-widest text-[13px]">Finalize Registration</Text>
                    <CheckCircle2 size={18} color="#fff" />
                  </View>
                )}
              </Button>
            </View>
          </DashboardCard>
        </View>

        {/* Right Column: Info/Helper */}
        <View className="p-3 w-full lg:w-1/3">
          <DashboardCard title="Registration Guide" className="mb-6">
            <View className="space-y-4">
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 bg-primary-600/20 rounded-lg items-center justify-center mt-0.5">
                  <Shield size={12} color="#38bdf8" />
                </View>
                <Text className="text-slate-400 text-xs leading-relaxed flex-1">
                  A unique <Text className="text-primary-600 font-inter-bold">Vendor ID</Text> will be automatically generated upon successful registration.
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 bg-primary-600/20 rounded-lg items-center justify-center mt-0.5">
                  <Store size={12} color="#38bdf8" />
                </View>
                <Text className="text-slate-400 text-xs leading-relaxed flex-1">
                  Once registered, the vendor can immediately access their dedicated dashboard using the provided email and password.
                </Text>
              </View>
            </View>
          </DashboardCard>

          <View className="bg-primary-600/10 border border-primary-500/20 p-6 rounded-3xl">
            <Text className="text-primary-600 font-inter-bold text-lg mb-2">Automated Onboarding</Text>
            <Text className="text-slate-500 text-xs leading-relaxed">
              Our system handles credential generation and database indexing in real-time. Please ensure the email address is correct as it will be used for official communications.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
