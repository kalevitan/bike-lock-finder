import { useLoaderData } from "react-router-dom";
import Marker from "./Marker";
import { MarkerProps as MarkerData } from "../types/types";

interface MarkerProps {
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
}

const MarkerList: React.FC<MarkerProps> = ({ openMarkerId, onMarkerClick, onMarkerClose }) => {
  const markerData = useLoaderData() as MarkerData[];

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