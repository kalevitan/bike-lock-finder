import { useMemo } from "react";
import Marker from "./Marker";
import { MarkerProps } from "@/interfaces/markers";

interface MarkerListProps {
  markerData: MarkerProps[];
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
  onEditPoint: (pointData: MarkerProps) => void;
}

const MarkerList: React.FC<MarkerListProps> = ({
  markerData,
  openMarkerId,
  onMarkerClick,
  onMarkerClose,
  onEditPoint
}) => {
  const markers = useMemo(() => (
    markerData.map((marker) => (
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

export default MarkerList;