'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { MapContextProps } from '@/interfaces/map';

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapConfig = useMemo<MapContextProps>(() => ({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['marker', 'places'],
    mapId: 'b752bc18ec3c0879', // gray map: 739af084373f96fe
    mapTypeId: 'roadmap',
    defaultCenter: { lat: 35.5946, lng: -82.5540 },
    defaultZoom: 14,
    version: "beta",
  }), []);

  return (
    <MapContext.Provider value={mapConfig}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};