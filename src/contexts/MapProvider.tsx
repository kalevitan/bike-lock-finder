'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { MapContextProps } from '@/interfaces/map';

const MapProviderContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapConfig = useMemo<MapContextProps>(() => ({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['marker', 'places'],
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || '',
    mapTypeId: 'roadmap',
    defaultCenter: { lat: 35.5946, lng: -82.5540 },
    defaultZoom: 14,
    version: "beta",
  }), []);

  return (
    <MapProviderContext.Provider value={mapConfig}>
      {children}
    </MapProviderContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapProviderContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
