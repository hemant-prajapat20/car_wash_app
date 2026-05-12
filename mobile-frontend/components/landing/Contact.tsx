import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const Contact = () => {
  return (
    <View id="contact" className="py-12 md:py-20 bg-white px-4 md:px-8">
      <View className="max-w-7xl mx-auto">
        <View className="mb-10 md:mb-12 items-center md:items-start">
          <Text className="text-primary-600 font-inter-bold text-[10px] uppercase tracking-widest mb-2">Get in Touch</Text>
          <Text className="text-3xl font-inter-bold text-slate-900 mb-4">Let's grow together</Text>
          <Text className="text-sm text-slate-500 font-inter-medium max-w-xl text-center md:text-left">
            Have questions? Our team of experts is ready to help you optimize your car wash operations with the latest technology.
          </Text>
        </View>

        <View className="flex-col lg:flex-row gap-8 md:gap-12">
          {/* Contact Form */}
          <View className="flex-[1.2]">
            <Card className="p-6 md:p-8 border-slate-100 shadow-sm">
               <View className="space-y-4 md:space-y-6">
                  <View className="flex-col md:flex-row gap-4 md:gap-6">
                    <View className="flex-1 space-y-2">
                      <Text className="text-[10px] font-inter-bold text-slate-500 uppercase ml-1">Full Name</Text>
                      <TextInput 
                        placeholder="John Doe" 
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-inter-medium text-slate-900 text-sm"
                      />
                    </View>
                    <View className="flex-1 space-y-2">
                      <Text className="text-[10px] font-inter-bold text-slate-500 uppercase ml-1">Work Email</Text>
                      <TextInput 
                        placeholder="john@business.com" 
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-inter-medium text-slate-900 text-sm"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  <View className="space-y-2">
                    <Text className="text-[10px] font-inter-bold text-slate-500 uppercase ml-1">Message</Text>
                    <TextInput 
                      placeholder="How can we help?" 
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-inter-medium text-slate-900 text-sm min-h-[120px]"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <Button size="md" className="w-full py-4 rounded-2xl shadow-md">
                    <Text className="text-white font-inter-bold text-sm">Send Message</Text>
                    <Send size={16} color="#fff" className="ml-2" />
                  </Button>
               </View>
            </Card>
          </View>

          {/* Info Grid */}
          <View className="flex-1 flex-row flex-wrap -m-2">
            {[
              { icon: Mail, label: 'Email', value: 'support@aquawash.io', color: '#0ea5e9', bg: 'bg-sky-50' },
              { icon: Phone, label: 'Sales', value: '+1 (888) 555-0123', color: '#16a34a', bg: 'bg-green-50' },
              { icon: MapPin, label: 'Office', value: 'San Francisco, CA', color: '#e11d48', bg: 'bg-rose-50' },
              { icon: MessageSquare, label: 'Live Chat', value: '24/7 Support', color: '#9333ea', bg: 'bg-purple-50' },
            ].map((item, idx) => (
              <View key={idx} className="w-1/2 p-2">
                <Card className="p-4 items-center text-center border-slate-50 h-full justify-center">
                  <View className={`w-10 h-10 md:w-12 md:h-12 ${item.bg} rounded-2xl items-center justify-center mb-3`}>
                    <item.icon size={18} color={item.color} />
                  </View>
                  <Text className="text-[9px] font-inter-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</Text>
                  <Text className="text-xs font-inter-semibold text-slate-900" numberOfLines={1}>{item.value}</Text>
                </Card>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
