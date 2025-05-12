import { useMemo } from "react";
import { Marker } from "./Marker";
import { MarkerListProps, MarkerProps } from "@/interfaces/markers";

export default function MarkerList({
  markerData,
  openMarkerId,
  onMarkerClick,
  onMarkerClose,
  onEditPoint
}: MarkerListProps) {
  const markers = useMemo(() => (
    markerData.map((marker: MarkerProps) => (
      <Marker
        key={marker.id}
        {...marker}
        isOpen={openMarkerId === marker.id}
        onClick={() => onMarkerClick(marker.id)}
        onClose={() => onMarkerClose(marker.id)}
        onEditPoint={() => onEditPoint(marker)}
      />
    ))
  ), [markerData, openMarkerId, onMarkerClick, onMarkerClose, onEditPoint]);

  return <>{markers}</>;
}
