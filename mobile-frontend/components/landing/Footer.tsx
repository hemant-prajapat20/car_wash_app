import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { WashingMachine, Twitter, Github, Linkedin, Facebook, Mail, ExternalLink } from 'lucide-react-native';

export const Footer = () => {
  const columns = [
    { title: 'Platform', links: ['Features', 'Integrations', 'API Docs', 'Security'] },
    { title: 'Company', links: ['Our Story', 'Success Stories', 'Partners', 'Careers'] },
    { title: 'Support', links: ['Help Center', 'System Status', 'Community', 'Contact'] },
  ];

  return (
    <View className="bg-slate-950 pt-16 pb-8 px-4 md:px-8 border-t border-slate-900">
      <View className="max-w-7xl mx-auto">
        <View className="flex-col lg:flex-row gap-12 lg:gap-16 pb-12 border-b border-slate-900">
          {/* Logo and Description */}
          <View className="flex-[1.5] space-y-6">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 bg-primary-600 rounded-xl items-center justify-center shadow-lg shadow-primary-900/50">
                <WashingMachine size={22} color="#fff" />
              </View>
              <Text className="text-2xl font-inter-bold text-white tracking-tighter">AquaWash</Text>
            </View>
            <Text className="text-sm text-slate-400 font-inter-medium leading-relaxed max-w-sm">
              The professional operating system for the modern car wash industry. Engineered to scale your revenue and automate your operations.
            </Text>
            <View className="flex-row gap-3">
               {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                 <Pressable key={i} className="w-9 h-9 bg-slate-900/50 border border-slate-800 rounded-xl items-center justify-center active:bg-primary-600 transition-all">
                   <Icon size={16} color="#94a3b8" />
                 </Pressable>
               ))}
            </View>
          </View>

          {/* Dynamic Columns */}
          <View className="flex-[3] flex-row flex-wrap">
             {columns.map((col, idx) => (
               <View key={idx} className="w-1/2 md:w-1/3 space-y-5 mb-8 md:mb-0">
                 <Text className="text-white font-inter-bold text-[11px] uppercase tracking-[0.2em]">{col.title}</Text>
                 <View className="space-y-3">
                    {col.links.map((link, lIdx) => (
                      <Pressable key={lIdx} className="flex-row items-center group">
                        <Text className="text-slate-500 font-inter-medium text-[13px] hover:text-white transition-colors">{link}</Text>
                      </Pressable>
                    ))}
                 </View>
               </View>
             ))}
          </View>

          {/* Professional Newsletter Section */}
          <View className="flex-[1.5] space-y-5">
             <Text className="text-white font-inter-bold text-[11px] uppercase tracking-[0.2em]">Stay Updated</Text>
             <Text className="text-slate-500 text-[13px] font-inter-medium leading-relaxed">
               Join 5,000+ business owners receiving weekly car wash insights.
             </Text>
             <View className="flex-row gap-2">
                <View className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex-row items-center gap-2">
                   <Mail size={14} color="#64748b" />
                   <Text className="text-slate-500 text-xs font-inter-medium">Email address</Text>
                </View>
                <Pressable className="bg-primary-600 px-4 py-2.5 rounded-xl items-center justify-center">
                   <Text className="text-white text-xs font-inter-bold">Join</Text>
                </Pressable>
             </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View className="pt-8 flex-col md:flex-row items-center justify-between gap-6">
           <View className="flex-row items-center gap-2">
             <Text className="text-slate-600 font-inter-medium text-xs">
               © 2024 AquaWash Platform Inc.
             </Text>
             <View className="w-1 h-1 bg-slate-800 rounded-full" />
             <Text className="text-slate-600 font-inter-medium text-xs">Made with Precision</Text>
           </View>
           
           <View className="flex-row items-center gap-8">
              <Pressable className="flex-row items-center gap-2">
                <View className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                <Text className="text-slate-400 font-inter-semibold text-xs">All Systems Operational</Text>
              </Pressable>
              <Pressable className="flex-row items-center gap-1 border-b border-slate-800 pb-0.5">
                <Text className="text-slate-500 font-inter-medium text-xs">Privacy Policy</Text>
                <ExternalLink size={10} color="#475569" />
              </Pressable>
           </View>
        </View>
      </View>
    </View>
  );
};
