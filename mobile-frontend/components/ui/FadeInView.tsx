import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import { useInView } from 'react-intersection-observer';
import { Platform } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export const FadeInView = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 800 
}: FadeInViewProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? 40 : direction === 'down' ? -40 : 0);
  const translateX = useSharedValue(direction === 'left' ? 40 : direction === 'right' ? -40 : 0);

  // Intersection observer for web
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (inView) {
        opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.quad) }));
        translateY.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.quad) }));
        translateX.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.quad) }));
      }
    } else {
      // For mobile, just animate on mount or use a different trigger if needed
      opacity.value = withDelay(delay, withTiming(1, { duration }));
      translateY.value = withDelay(delay, withTiming(0, { duration }));
      translateX.value = withDelay(delay, withTiming(0, { duration }));
    }
  }, [inView]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    };
  });

  if (Platform.OS === 'web') {
    return (
      <div ref={ref}>
        <Animated.View style={animatedStyle}>
          {children}
        </Animated.View>
      </div>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};
