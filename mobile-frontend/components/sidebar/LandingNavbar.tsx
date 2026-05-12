import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, ScrollView as RNScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Menu, X, WashingMachine } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Button } from '../ui/Button';

interface NavLink {
  name: string;
  id: string;
  path: string;
}

interface LandingNavbarProps {
  scrollRef?: React.RefObject<RNScrollView>;
  activeSection?: string;
  onNavPress?: (id: string) => void;
}

const LandingNavbar = ({ scrollRef, activeSection: externalActiveSection, onNavPress }: LandingNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [internalActiveSection, setInternalActiveSection] = useState('home');
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const activeSection = externalActiveSection || internalActiveSection;

  const navLinks: NavLink[] = [
    { name: 'Home', id: 'home', path: '/' },
    { name: 'Features', id: 'features', path: '/features' },
    { name: 'About', id: 'about', path: '/about' },
    { name: 'Statistics', id: 'stats', path: '/stats' },
    { name: 'Contact', id: 'contact', path: '/contact' },
  ];

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);

        if (!externalActiveSection) {
          const sections = ['home', 'features', 'about', 'stats', 'contact'];
          let current = 'home';
          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 150 && rect.bottom >= 150) {
                current = id;
                break;
              }
            }
          }
          setInternalActiveSection(current);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [externalActiveSection]);

  const handleNavPress = (id: string, path: string) => {
    setIsOpen(false);
    if (onNavPress) {
      onNavPress(id);
      return;
    }

    if (Platform.OS === 'web' && (pathname === '/' || pathname === '')) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return;
      }
    }
    router.push(path as any);
  };

  const handlePortalClick = () => {
    if (isAuthenticated) {
      router.push(user?.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <View 
      style={Platform.OS === 'web' ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : '#ffffff'
      } : {}}
      className={`py-3 px-4 md:px-8 transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-slate-200/50 py-2.5' : 'border-b border-transparent'}`}
    >
      <View className="max-w-7xl mx-auto w-full flex-row justify-between items-center">
        {/* Professional SaaS Logo */}
        <Pressable className="flex-row items-center gap-2.5 active:opacity-70" onPress={() => handleNavPress('home', '/')}>
          <View className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
            <WashingMachine size={20} color="#fff" />
          </View>
          <View>
            <Text className="font-inter-bold text-xl text-slate-900 tracking-tighter leading-none">AquaWash</Text>
            <Text className="text-[9px] font-inter-bold text-primary-600 uppercase tracking-widest mt-0.5">Premium SaaS</Text>
          </View>
        </Pressable>

        {/* Desktop Navigation Links */}
        <View className="hidden lg:flex flex-row items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && (pathname === '/' || pathname === '');
            return (
              <Pressable 
                key={link.id} 
                onPress={() => handleNavPress(link.id, link.path)}
                className="px-4 py-2 group relative"
              >
                <Text className={`text-[13px] transition-colors duration-300 ${isActive ? 'text-primary-600 font-inter-semibold' : 'text-slate-400 font-inter-medium group-hover:text-slate-800'}`}>
                  {link.name}
                </Text>
                {/* Active Underline Indicator */}
                <View 
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Access Portal / Dashboard CTA */}
        <View className="hidden md:flex flex-row items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="px-4" onPress={() => router.push('/login')}>
                <Text className="text-[13px] font-inter-semibold text-slate-600">Login</Text>
              </Button>
              <Button size="sm" className="px-6 py-2.5 rounded-xl shadow-lg shadow-primary-100" onPress={handlePortalClick}>
                <Text className="text-[13px] font-inter-semibold">Get Started</Text>
              </Button>
            </>
          ) : (
            <Button size="sm" className="px-6 rounded-xl" onPress={handlePortalClick}>
              <Text className="text-[13px] font-inter-semibold">Dashboard</Text>
            </Button>
          )}
        </View>

        {/* Mobile Hamburger Menu Toggle */}
        <View className="lg:hidden">
          <Pressable onPress={() => setIsOpen(!isOpen)} className="p-2 bg-slate-50 rounded-lg active:bg-slate-100">
            {isOpen ? <X size={20} color="#0f172a" /> : <Menu size={20} color="#0f172a" />}
          </Pressable>
        </View>
      </View>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <View className="lg:hidden mt-3 space-y-1 bg-white rounded-2xl p-2 border border-slate-100 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Pressable 
                key={link.id} 
                onPress={() => handleNavPress(link.id, link.path)} 
                className={`px-4 py-3.5 rounded-xl flex-row items-center justify-between ${isActive ? 'bg-primary-50' : 'active:bg-slate-50'}`}
              >
                <Text className={`text-sm ${isActive ? 'text-primary-600 font-inter-semibold' : 'text-slate-400 font-inter-medium'}`}>
                  {link.name}
                </Text>
                {isActive && <View className="w-1.5 h-1.5 bg-primary-600 rounded-full" />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default LandingNavbar;
