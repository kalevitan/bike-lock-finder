import Marker from "./Marker";
import { MarkerProps } from "@/src/interfaces/markers";

interface MarkerListProps {
  markerData: MarkerProps[];
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
  onEditPoint: (pointData: MarkerProps) => void;
}

const MarkerList: React.FC<MarkerListProps> = ({ markerData, openMarkerId, onMarkerClick, onMarkerClose, onEditPoint }) => {
  return (
    <>
      {markerData.map((marker) => (
        <Marker
          key={marker.id}
          {...marker}
          isOpen={openMarkerId === marker.id}
          onClick={() => onMarkerClick(marker.id)}
          onClose={() => onMarkerClose(marker.id)}
          onEditPoint={() => onEditPoint(marker)}
        />
      ))}
    </>
  );
}

export default MarkerList;