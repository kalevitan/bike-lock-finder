import Marker from "./Marker";
import { MarkerProps as MarkerData } from "@/src/interfaces/markers";

interface MarkerProps extends MarkerData {
  markerData: MarkerData[];
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
  onEditPoint: (pointData: MarkerData) => void;
}

const MarkerList: React.FC<MarkerProps> = ({ markerData, openMarkerId, onMarkerClick, onMarkerClose, onEditPoint }) => {
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