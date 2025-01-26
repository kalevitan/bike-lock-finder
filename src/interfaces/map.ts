import { MarkerProps } from './markers';

export interface MapContextProps {
  apiKey: string;
  libraries?: string[];
  version: string;
  mapId: string;
  mapTypeId: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

export interface Location {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface MapContentProps {
  location: Location | null,
  place: google.maps.places.PlaceResult | null,
  openMarkerId: string | null,
  onMarkerClick: (id: string) => void,
  onMarkerClose: (id: string) => void,
  onEditPoint: (pointData: MarkerProps) => void;
}