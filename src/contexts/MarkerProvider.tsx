"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { MarkerContextProps, MarkerProps } from "@/interfaces/markers";

const MarkerProviderContext = createContext<MarkerContextProps | undefined>(
  undefined
);
const LOCAL_STORAGE_KEY = "newly_added_markers";

export const MarkerProvider = ({ children }: { children: ReactNode }) => {
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addOptimisticMarker = (newMarker: MarkerProps) => {
    // Add the new marker to local storage with a timestamp
    const now = new Date().getTime();
    const existing = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
    );
    existing.push({ ...newMarker, addedAt: now });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));

    // Also add it directly to the current state for an instant UI update
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const refreshMarkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/markers");
      const data = await response.json();

      // Get optimistic updates from local storage
      const now = new Date().getTime();
      let optimisticMarkers: (MarkerProps & { addedAt: number })[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );

      // Filter out optimistic markers older than 10 minutes to prevent build-up
      optimisticMarkers = optimisticMarkers.filter(
        (m) => now - m.addedAt < 10 * 60 * 1000
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(optimisticMarkers)
      );

      // Combine the lists, ensuring no duplicates if the API has caught up
      const apiMarkerIds = new Set(data.map((m: MarkerProps) => m.id));
      const uniqueOptimisticMarkers = optimisticMarkers.filter(
        (m) => !apiMarkerIds.has(m.id)
      );

      setMarkers([...data, ...uniqueOptimisticMarkers]);
    } catch (error) {
      console.error("Error fetching markers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMarkers();
  }, [refreshMarkers]);

  return (
    <MarkerProviderContext.Provider
      value={{
        markers,
        setMarkers,
        isLoading,
        refreshMarkers,
        addOptimisticMarker,
      }}
    >
      {children}
    </MarkerProviderContext.Provider>
  );
};

export const useMarkerContext = () => {
  const context = useContext(MarkerProviderContext);
  if (!context) {
    throw new Error("useMarkerContext must be used within a MarkerProvider");
  }
  return context;
};
