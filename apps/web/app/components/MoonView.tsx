'use client';
import moonImg from '../../public/moon.png';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styles from './MoonView.module.css'

interface MoonViewProps {
  phase: number;
  animated?: boolean;
}

export function MoonView({ phase: initialPhase, animated = false }: MoonViewProps) {  
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

  const size = 100;
  const radius = 50;

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
    <div className={styles.moonContainer}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={styles.moonSvg}
      >
        <image
          href={moonImg.src}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid slice"
        />
        <path d={shadowPath} fill="rgba(0, 0, 0, 0.88)" />
      </svg>
    </div>
  );
}

