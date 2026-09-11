'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  initialCoords?: { latitude: number; longitude: number } | null;
  onSelectLocation: (coords: { latitude: number; longitude: number }) => void;
}

// Sub-component to handle map click events
function LocationPicker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      {...({
        position,
        icon: customIcon,
        children: <Popup>Selected Location</Popup>,
      } as any)}
    />
  );
}

export default function Map({ initialCoords, onSelectLocation }: MapProps) {
  const initialPos: [number, number] = [
    initialCoords?.latitude ?? 51.505,
    initialCoords?.longitude ?? -0.09,
  ];

  const [selectedPos, setSelectedPos] = useState<[number, number]>(initialPos);

  const handleConfirm = () => {
    onSelectLocation({
      latitude: selectedPos[0],
      longitude: selectedPos[1],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          {...({
            center: initialPos,
            zoom: 6,
            scrollWheelZoom: true,
            style: { height: '100%', width: '100%' },
            children: (
              <>
                <TileLayer
                  {...({
                    attribution:
                      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  } as any)}
                />
                <LocationPicker position={selectedPos} setPosition={setSelectedPos} />
              </>
            ),
          } as any)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>
          Lat: {selectedPos[0].toFixed(4)}, Lng: {selectedPos[1].toFixed(4)}
        </span>
        <button
          onClick={handleConfirm}
          style={{
            padding: '8px 16px',
            backgroundColor: '#16c79a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}