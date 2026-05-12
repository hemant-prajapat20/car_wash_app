import React from 'react';
import { View, Text, Image } from 'react-native';
import { Target, Rocket, ShieldCheck, Award, Zap, Heart } from 'lucide-react-native';

export const About = () => {
  const benefits = [
    { title: 'Efficiency', desc: 'Reduce work by 70%.', icon: Rocket, sub: 'ROI' },
    { title: 'Security', desc: 'Secure flows.', icon: ShieldCheck, sub: 'Safe' },
    { title: 'Growth', desc: 'Data decisions.', icon: Target, sub: 'Scale' },
  ];

  return (
    <View id="about" className="py-12 md:py-20 bg-white px-4 md:px-8 border-b border-slate-50">
      <View className="max-w-7xl mx-auto">
        <View className="flex-col lg:flex-row items-center gap-10 md:gap-16">
          <View className="flex-1 w-full">
            <View className="bg-primary-600 rounded-2xl w-full aspect-[16/10] overflow-hidden shadow-xl">
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=1200" }} 
                className="w-full h-full opacity-90"
                resizeMode="cover"
              />
            </View>
            
            {/* Optimized Micro-Badges for Mobile to prevent cut-off */}
            <View className="flex-row flex-wrap justify-between gap-2 mt-6">
              {[
                { icon: Award, label: 'Rated', val: '2024' },
                { icon: Zap, label: 'Fast', val: 'Setup' },
                { icon: Heart, label: 'Loved', val: '10k+' }
              ].map((m, i) => (
                <View key={i} className="flex-1 min-w-[90px] flex-row items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <m.icon size={14} color="#0284c7" />
                  <View>
                    <Text className="text-[9px] font-inter-bold text-slate-400 uppercase leading-none">{m.label}</Text>
                    <Text className="text-[10px] font-inter-bold text-slate-900">{m.val}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="flex-1 space-y-6 md:space-y-8">
            <View>
              <Text className="text-primary-600 font-inter-bold text-[10px] uppercase tracking-widest mb-3">Our Story</Text>
              <Text className="text-3xl md:text-4xl font-inter-bold text-slate-900 leading-tight mb-4 pr-4">
                Empowering the Future of Car Care
              </Text>
              <Text className="text-sm md:text-base text-slate-500 font-inter-medium leading-relaxed">
                We provide a unified ecosystem that benefits both business owners and vehicle owners through intelligent automation and real-time insights.
              </Text>
            </View>

            {/* Optimized Benefits Grid for Mobile */}
            <View className="flex-row flex-wrap -m-1.5">
              {benefits.map((item, idx) => (
                <View key={idx} className="w-1/3 p-1.5">
                  <View className="bg-white border border-slate-100 rounded-xl p-3 items-center text-center h-full shadow-sm">
                    <View className="w-8 h-8 bg-primary-50 rounded-lg items-center justify-center mb-2">
                      <item.icon size={16} color="#0284c7" />
                    </View>
                    <Text className="text-[10px] font-inter-bold text-slate-900 mb-1">{item.title}</Text>
                    <Text className="text-[8px] text-slate-500 font-inter-medium leading-tight mb-2">{item.desc}</Text>
                    <View className="px-1.5 py-0.5 bg-green-50 rounded">
                       <Text className="text-[7px] font-inter-bold text-green-600 uppercase">{item.sub}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
