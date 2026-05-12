import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Palette, 
  Database,
  ChevronRight,
  LogOut
} from 'lucide-react-native';
import { DashboardCard } from '../../components/admin/DashboardComponents';

export default function SettingsPage() {
  const SettingItem = ({ icon: Icon, label, value, showToggle, color = '#94a3b8' }: any) => (
    <Pressable className="flex-row items-center justify-between py-4 border-b border-slate-50 last:border-0 active:opacity-60">
      <View className="flex-row items-center gap-4">
        <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
           <Icon size={18} color={color} />
        </View>
        <View>
          <Text className="text-slate-900 font-inter-semibold text-sm">{label}</Text>
          {value && <Text className="text-slate-500 text-[10px] uppercase font-inter-bold tracking-widest mt-0.5">{value}</Text>}
        </View>
      </View>
      {showToggle ? (
        <Switch 
          trackColor={{ false: '#1e293b', true: '#0ea5e9' }}
          thumbColor="#fff"
          value={true}
        />
      ) : (
        <ChevronRight size={16} color="#334155" />
      )}
    </Pressable>
  );

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-8">
        <Text className="text-slate-900 font-inter-bold text-2xl tracking-tight">Platform Settings</Text>
        <Text className="text-slate-500 text-sm font-inter-medium mt-1">Configure system behavior and admin profile</Text>
      </View>

      <View className="flex-row flex-wrap -m-3">
        <View className="p-3 w-full lg:w-2/3">
          <DashboardCard title="System Configuration" className="mb-6">
             <View>
                <Text className="text-slate-500 text-[10px] font-inter-bold uppercase tracking-widest mb-4">Account & Profile</Text>
                <SettingItem icon={User} label="Admin Profile" value="admin@aquawash.saas" color="#38bdf8" />
                <SettingItem icon={Lock} label="Security & Password" value="Last changed 3 months ago" color="#10b981" />
                
                <Text className="text-slate-500 text-[10px] font-inter-bold uppercase tracking-widest mb-4 mt-8">Platform Control</Text>
                <SettingItem icon={Bell} label="Global Notifications" showToggle />
                <SettingItem icon={Shield} label="Two-Factor Authentication" showToggle />
                <SettingItem icon={Globe} label="Public Registration" showToggle />
                
                <Text className="text-slate-500 text-[10px] font-inter-bold uppercase tracking-widest mb-4 mt-8">Data Management</Text>
                <SettingItem icon={Database} label="System Backups" value="Daily at 02:00 AM" />
                <SettingItem icon={Smartphone} label="Mobile App Config" />
             </View>
          </DashboardCard>
        </View>

        <View className="p-3 w-full lg:w-1/3">
          <DashboardCard title="Interface Theme" className="mb-6">
              <View className="space-y-4">
                <View className="flex-row items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                   <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-white rounded-lg items-center justify-center border border-slate-100">
                         <Palette size={16} color="#94a3b8" />
                      </View>
                      <Text className="text-slate-500 font-inter-bold text-xs">Midnight SaaS</Text>
                   </View>
                </View>
                <View className="flex-row items-center justify-between p-3 bg-primary-50 rounded-2xl border border-primary-500/30">
                   <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm">
                         <Palette size={16} color="#0ea5e9" />
                      </View>
                      <Text className="text-primary-600 font-inter-bold text-xs">Light Enterprise (Active)</Text>
                   </View>
                </View>
             </View>
          </DashboardCard>

          <Pressable className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex-row items-center justify-between group active:bg-red-500/20 transition-all">
             <View>
                <Text className="text-red-500 font-inter-bold text-base">Terminate Session</Text>
                <Text className="text-red-500/60 text-[10px] uppercase font-inter-bold tracking-widest mt-1">Danger Zone</Text>
             </View>
             <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center shadow-lg shadow-red-900">
                <LogOut size={20} color="#fff" />
             </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
