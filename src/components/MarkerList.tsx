'use client';

import { useEffect, useState } from "react";
import Marker from "./Marker";
import { MarkerProps as MarkerData } from "../types/types";

interface MarkerProps {
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
}

const MarkerList: React.FC<MarkerProps> = ({ openMarkerId, onMarkerClick, onMarkerClose }) => {
  const [markerData, setMarkerData] = useState<MarkerData[]>([]);

  useEffect(() => {
    const fetchMarkerData = async () => {
      const response = await fetch('/api/markers');
      const data = await response.json();
      setMarkerData(data);
    }

    fetchMarkerData();
  }, []);

  return (
    <>
      {markerData.map((marker) => (
        <Marker
          key={marker.id}
          {...marker}
          isOpen={openMarkerId === marker.id}
          onClick={() => onMarkerClick(marker.id)}
          onClose={() => onMarkerClose(marker.id)}/>
      ))}
    </>
  );
}

export default MarkerList;