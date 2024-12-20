import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarkerContextProps, MarkerProps } from '@/src/interfaces/markers';

const MarkerContext = createContext<MarkerContextProps | undefined>(undefined);

export const MarkerProvider = ({ children }: { children: ReactNode }) => {
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const response = await fetch('/api/markers');
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching markers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarkerData();
  }, []);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers, isLoading }}>
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