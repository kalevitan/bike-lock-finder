export interface MapContextProps {
  apiKey: string;
  libraries?: string[];
  version: string;
  mapId: string;
  mapTypeId: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

export interface MarkerProps {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
}