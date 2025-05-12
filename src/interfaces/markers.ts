export interface MarkerContextProps {
  markers: MarkerProps[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>;
  isLoading: boolean;
  refreshMarkers: () => Promise<void>;
}

export interface MarkerData {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
  rating: number;
  file: File | string | null;
  isOpen?: boolean;
}

export interface MarkerProps extends MarkerData {
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  onEditPoint: (pointData: MarkerData) => void;
}

export interface MarkerListProps {
  markerData: MarkerProps[];
  openMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerClose: (id: string) => void;
  onEditPoint: (pointData: MarkerProps) => void;
}