import Marker from "./Marker";
import { MarkerProps as MarkerData } from "@/src/types/types";

interface MarkerProps {
  markerData: MarkerData[];
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
}

const MarkerList: React.FC<MarkerProps> = ({ markerData, openMarkerId, onMarkerClick, onMarkerClose }) => {
  return (
    <>
      {markerData.map((marker) => (
        <Marker
          key={marker.id}
          {...marker}
          isOpen={openMarkerId === marker.id}
          onClick={() => onMarkerClick(marker.id)}
          onClose={() => onMarkerClose(marker.id)}
        />
      ))}
    </>
  );
}

export default MarkerList;