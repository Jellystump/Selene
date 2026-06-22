// components/MoonView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Image, Path } from 'react-native-svg';

interface MoonViewProps {
  phase: number;
  animated?: boolean;
}

export function MoonView({ phase: initialPhase, animated = false }: MoonViewProps) {
  const radius = 100;
  const [currentPhase, setCurrentPhase] = useState(initialPhase);
  const animationRef = useRef<number>();

  // Animation loop
  useEffect(() => {
    if (!animated) {
      setCurrentPhase(initialPhase);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const loop = () => {
      // Add 0.5 degrees per frame. Adjusting this number changes the speed.
      setCurrentPhase((prev) => (prev + 0.5) % 360);
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animated, initialPhase]);

  const normalizedPhase = currentPhase % 360;
  const isWaxing = normalizedPhase <= 180; // Fase creciente (0 a 180)
  
  // Calculating the thickness of the shadow ellipse
  const rx = radius * Math.abs(Math.cos((normalizedPhase * Math.PI) / 180));

  // sweepFlag1: Decide which side the outer edge of the shadow is anchored to.
  const sweepFlag1 = isWaxing ? 0 : 1;

  // sweepFlag2: It determines which way the inner curve bends.
  let sweepFlag2 = 0;
  if (normalizedPhase <= 90) sweepFlag2 = 0;      
  else if (normalizedPhase <= 180) sweepFlag2 = 1; 
  else if (normalizedPhase <= 270) sweepFlag2 = 0;
  else sweepFlag2 = 1;                           

  // M: Move to. A: Arc outside. A: Arc Inside. Z: Close.
  const shadowPath = `
    M ${radius} 0 
    A ${radius} ${radius} 0 0 ${sweepFlag1} ${radius} ${radius * 2} 
    A ${rx} ${radius} 0 0 ${sweepFlag2} ${radius} 0 
    Z
  `;

  return (
    <View style={styles.moonContainer}>
      <Svg height={radius * 2} width={radius * 2}>
        {/*Moon */}
        <Image
          href={require('../assets/images/moon.png')}
          width={radius * 2}
          height={radius * 2}
          preserveAspectRatio="xMidYMid slice"
        />

        {/*Shadow */}
        <Path 
          d={shadowPath} 
          fill="rgba(0, 0, 0, 0.88)" 
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  moonContainer: {
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    overflow: 'hidden',
    backgroundColor: 'black' 
  }
});