import React, { createContext, useContext, ReactNode } from 'react';

interface MapContextProps {
  apiKey: string;
  mapId: string;
  mapTypeId: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapConfig: MapContextProps = {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    mapId: '739af084373f96fe',
    mapTypeId: 'roadmap',
    defaultCenter: { lat: 35.60, lng: -82.55 },
    defaultZoom: 14,
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