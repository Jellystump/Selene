import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import Svg, { Image, Path } from 'react-native-svg';

interface MoonViewProps {
  phase: number;
  animated?: boolean;
}

export function MoonView({ phase: initialPhase, animated = false }: MoonViewProps) {
  // 1. Manage size dynamically via state (starts at 0 until measured)
  const [size, setSize] = useState<number>(0);
  const radius = size / 2;
  
  const [currentPhase, setCurrentPhase] = useState(initialPhase);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!animated) {
      setCurrentPhase(initialPhase);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const loop = () => {
      setCurrentPhase((prev) => (prev + 0.5) % 360);
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animated, initialPhase]);

  // 2. Measure the parent container dimensions automatically
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    // Use the smaller dimension to keep the moon perfectly circular
    setSize(Math.min(width, height));
  };

  const normalizedPhase = currentPhase % 360;
  const isWaxing = normalizedPhase <= 180;
  const rx = radius * Math.abs(Math.cos((normalizedPhase * Math.PI) / 180));
  const sweepFlag1 = isWaxing ? 0 : 1;

  let sweepFlag2 = 0;
  if (normalizedPhase <= 90) sweepFlag2 = 0;      
  else if (normalizedPhase <= 180) sweepFlag2 = 1; 
  else if (normalizedPhase <= 270) sweepFlag2 = 0;
  else sweepFlag2 = 1;                           

  const shadowPath = `
    M ${radius} 0 
    A ${radius} ${radius} 0 0 ${sweepFlag1} ${radius} ${radius * 2} 
    A ${rx} ${radius} 0 0 ${sweepFlag2} ${radius} 0 
    Z
  `;

  return (
    /* 3. This parent container fills 100% of your screen's flex box */
    <View style={styles.moonContainer} onLayout={handleLayout}>
      {size > 0 && (
        <Svg 
          height={size} 
          width={size} 
          viewBox={`0 0 ${size} ${size}`}
          style={{ borderRadius: radius, overflow: 'hidden' }}
        >
          <Image
            href={require('../assets/images/moon.png')}
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid slice"
          />
          <Path 
            d={shadowPath} 
            fill="rgba(0, 0, 0, 0.88)" 
          />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  moonContainer: {
    flex: 1,               // 👈 Fills up the entire space assigned to cardContainerView1
    width: '100%',         // 👈 Ensures it stretches horizontally
    height: '100%',        // 👈 Ensures it stretches vertically
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent' 
  }
});