'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MarkerContextProps, MarkerProps } from '@/interfaces/markers';

const MarkerProviderContext = createContext<MarkerContextProps | undefined>(undefined);

export const MarkerProvider = ({ children }: { children: ReactNode }) => {
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMarkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/markers');
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching markers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMarkers();
  }, [refreshMarkers]);

  return (
    <MarkerProviderContext.Provider value={{ markers, setMarkers, isLoading, refreshMarkers }}>
      {children}
    </MarkerProviderContext.Provider>
  );
};

export const useMarkerContext = () => {
  const context = useContext(MarkerProviderContext);
  if (!context) {
    throw new Error('useMarkerContext must be used within a MarkerProvider');
  }
  return context;
};