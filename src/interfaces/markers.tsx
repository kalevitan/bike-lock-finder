export interface MarkerContextProps {
  markers: MarkerProps[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>;
  isLoading: boolean;
}

export interface MarkerProps {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
  rating: number;
  isOpen?: boolean;
}