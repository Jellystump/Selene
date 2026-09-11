'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getMoonPhase, getMoonIllumination } from "@selene/astronomy";
import { MoonView } from "./components/MoonView";
import { Colors } from '@selene/ui';
import styles from "./page.module.css";
import { SeleneCalendar } from './SeleneCalendar';

const DynamicMap = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <p style={{ color: '#fff' }}>Loading map...</p>,
});

interface EventAPI {
  title?: string;
  event_name?: string;
  date?: string;
  description?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    description: string;
  };
}

interface EventHighlightDetail {
  date: string;
  altitude: number;
}

interface ApiEventItem {
  type: string;
  rise?: string;
  set?: string;
  extraInfo?: {
    obscuration?: number;
  };
  eventHighlights?: {
    peak?: EventHighlightDetail;
  };
}

interface EventRowAPI {
  body: {
    id: string;
    name: string;
  };
  events: ApiEventItem[];
}

interface AstronomyApiResponse {
  data: {
    rows: EventRowAPI[];
  };
}

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [phase, setPhase] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [phaseName, setPhaseName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventCardLabel, setEventCardLabel] = useState<string>('Select an event');
  const [eventCardDesc, setEventCardDesc] = useState<string>('Select an event to visualize its information');

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

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        setLoading(true);
        const lat = coords?.latitude ?? 0;
        const lon = coords?.longitude ?? 0;

        const response = await fetch(`/api/astronomy?latitude=${lat}&longitude=${lon}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: AstronomyApiResponse = await response.json();

        const formattedEvents: CalendarEvent[] = [];

        (data.data?.rows || []).forEach((row, rowIndex) => {
          (row.events || []).forEach((evt, evtIndex) => {
            formattedEvents.push({
              id: `astro-${rowIndex}-${evtIndex}`,
              title: evt.type ? evt.type.replace(/_/g, ' ').toUpperCase() : 'Celestial Event',
              start: evt.rise || evt.eventHighlights?.peak?.date || new Date().toISOString(),
              allDay: true,
              backgroundColor: '#1a1a2e',
              borderColor: '#16c79a',
              extendedProps: {
                description: `Obscuration: ${evt.extraInfo?.obscuration ?? 'N/A'}`,
              },
            });
          });
        });

        setEvents(formattedEvents);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching celestial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [coords]);

  const handleLocationSelected = (selectedCoords: { latitude: number; longitude: number }) => {
    setCoords(selectedCoords);
    setIsModalOpen(false);
  };

  const handleEventClick = (info: { event: { title: string; extendedProps: { description?: string } } }) => {
    const title = info.event.title;
    const description = info.event.extendedProps.description || 'No additional details.';
    setEventCardLabel(title);
    setEventCardDesc(description);
  };

  return (
    <main className={styles.container}>
      <div className={styles.glowOverlay} />

      <header className={styles.header}>
        <div className={styles.logo}>SELENE</div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className={styles.locationBtn}
          disabled={loading}
        >
          {coords 
            ? `📍 ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}` 
            : '📍 Select Location'}
        </button>
      </header>

      <div className={styles.dashboard}>
        <section className={styles.heroSection}>
          <div className={styles.moonStage}>
            <div className={styles.moonGlow} />
            <MoonView phase={phase} animated={isAnimating} />
          </div>

          <div className={styles.heroTitle}>
            <h1>{phaseName}</h1>
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

          {(locationError || apiError) && (
            <div className={styles.errorNotice}>
              ⚠️ {locationError || apiError}
            </div>
          )}
        </aside>
      </div>

      <div className={styles.dashboard}>
        <SeleneCalendar events={events} onEventClick={handleEventClick} />
        <div className={styles.card}>
          <span className={styles.cardLabel}>{eventCardLabel}</span>
          <span className={styles.cardValue}>{eventCardDesc}</span>
        </div>
      </div>

      {/* Map Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            border: 'border: 1px solid rgba(255, 255, 255, 0.08);',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Click Map to Pick Location</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>
            <DynamicMap initialCoords={coords} onSelectLocation={handleLocationSelected} />
          </div>
        </div>
      )}
    </main>
  );
  
}