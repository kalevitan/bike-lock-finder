'use client';

import { createContext, useContext, ReactNode } from 'react';
import { MapContextProps } from '../../types/types';

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {

  const mapConfig: MapContextProps = {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['marker', 'places'],
    mapId: '739af084373f96fe',
    mapTypeId: 'roadmap',
    defaultCenter: { lat: 35.60, lng: -82.55 },
    defaultZoom: 15,
    version: "beta",
  };

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