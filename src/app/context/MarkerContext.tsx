import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarkerContextProps, MarkerProps } from '@/src/types/types';

const MarkerContext = createContext<MarkerContextProps | undefined>(undefined);

export const MarkerProvider = ({ children }: { children: ReactNode }) => {
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  useEffect(() => {
    const fetchMarkerData = async () => {
      const response = await fetch('/api/markers');
      const data = await response.json();
      setMarkers(data);
    }

    fetchMarkerData();
  }, []);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkerContext = () => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error('useMarkerContext must be used within a MarkerProvider');
  }
  return context;
};