import React, { useRef, useState, useCallback } from 'react';
import { ScrollView, View, Platform, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import LandingNavbar from '../components/sidebar/LandingNavbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { About } from '../components/landing/About';
import { Stats } from '../components/landing/Stats';
import { Contact } from '../components/landing/Contact';
import { Footer } from '../components/landing/Footer';

const SECTIONS = ['home', 'features', 'about', 'stats', 'contact'];

export default function LandingPage() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeSection, setActiveSection] = useState('home');
  const sectionOffsets = useRef<{ [key: string]: number }>({});

  // Measure section positions on layout (Works for Android/iOS/Web)
  const handleLayout = (id: string, y: number) => {
    sectionOffsets.current[id] = y;
  };

  // Handle scroll to section (Cross-platform)
  const scrollToSection = (id: string) => {
    const y = sectionOffsets.current[id];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - 80), animated: true });
    }
    setActiveSection(id);
  };

  // Detect active section on scroll (Native Mobile performance)
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = 150; // Offset for navbar height

    let current = 'home';
    SECTIONS.forEach((id) => {
      const offset = sectionOffsets.current[id];
      if (offset !== undefined && scrollY >= offset - threshold) {
        current = id;
      }
    });

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }, [activeSection]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Fixed Navbar with Active State Sync */}
      <LandingNavbar 
        scrollRef={scrollRef} 
        activeSection={activeSection} 
        onNavPress={scrollToSection}
      />
      
      <ScrollView 
        ref={scrollRef}
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={{ paddingTop: Platform.OS === 'web' ? 80 : 0 }}>
          <View onLayout={(e) => handleLayout('home', e.nativeEvent.layout.y)}>
            <Hero />
          </View>
          <View onLayout={(e) => handleLayout('features', e.nativeEvent.layout.y)}>
            <Features />
          </View>
          <View onLayout={(e) => handleLayout('about', e.nativeEvent.layout.y)}>
            <About />
          </View>
          <View onLayout={(e) => handleLayout('stats', e.nativeEvent.layout.y)}>
            <Stats />
          </View>
          <View onLayout={(e) => handleLayout('contact', e.nativeEvent.layout.y)}>
            <Contact />
          </View>
          <Footer />
        </View>
      </ScrollView>
    </View>
  );
}
