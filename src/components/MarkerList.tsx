import { useLoaderData } from "react-router-dom";
import Marker from "./Marker";

interface MarkerData {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
}
interface MarkerProps {
  markerData?: [];
}

const MarkerList: React.FC<MarkerProps> = () => {
  const markerData = useLoaderData() as MarkerData[];

  return (
    <>
      {markerData?.map((marker) => (
        <Marker key={marker.id} {...marker}/>
      ))}
    </>
  );
}

export default MarkerList;