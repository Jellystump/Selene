'use client';

import React, { useState, useEffect } from 'react';
import { getMoonPhase, getMoonIllumination } from "@selene/astronomy";
import { MoonView } from "./components/MoonView";
import { Colors } from '@selene/ui';
import styles from "./page.module.css";

export default function Home() {
  const [phase, setPhase] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [phaseName, setPhaseName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    const currentPhase = getMoonPhase(now);
    const illumination = getMoonIllumination(now);

    setPhase(currentPhase);
    setPercentage(Math.round(illumination));

    let name = 'New Moon';
    if (currentPhase >= 358 || currentPhase < 2) name = 'New Moon';
    else if (currentPhase < 88) name = 'Waxing Crescent';
    else if (currentPhase <= 92) name = 'First Quarter';
    else if (currentPhase < 178) name = 'Waxing Gibbous';
    else if (currentPhase <= 182) name = 'Full Moon';
    else if (currentPhase < 268) name = 'Waning Gibbous';
    else if (currentPhase <= 272) name = 'Third Quarter';
    else name = 'Waning Crescent';

    setPhaseName(name);
    setLoading(false);
  }, []);

  const updateLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationError(null);
        setLoading(false);
      },
      () => {
        setLocationError('Location access denied.');
        setLoading(false);
      }
    );
  };

  return (
    <main className={styles.container}>
      {/* Background ambient glow */}
      <div className={styles.glowOverlay} />

      {/* Header Bar */}
      <header className={styles.header}>
        <div className={styles.logo}>SELENE</div>
        <button 
          onClick={updateLocation} 
          className={styles.locationBtn}
          disabled={loading}
        >
          {loading ? 'Locating...' : '📍 Sync Location'}
        </button>
      </header>

      {/* Main Content Dashboard */}
      <div className={styles.dashboard}>
        <section className={styles.heroSection}>
          <div className={styles.moonStage}>
            <div className={styles.moonGlow} />
            <MoonView phase={phase} animated={isAnimating} />
          </div>

          <div className={styles.heroTitle}>
            <h1>{phaseName}</h1>
            <p className={styles.subtext}>{percentage}% Illuminated</p>
          </div>
        </section>

        <aside className={styles.panelSection}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>Current Phase Angle</span>
            <span className={styles.cardValue}>{phase.toFixed(1)}°</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(phase / 360) * 100}%` }} 
              />
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Illumination</span>
              <span className={styles.cardValueSmall}>{percentage}%</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Cycle Stage</span>
              <span className={styles.cardValueSmall}>
                {phase <= 180 ? 'Waxing' : 'Waning'}
              </span>
            </div>
          </div>



          {locationError && (
            <div className={styles.errorNotice}>
              ⚠️ {locationError}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}