export interface MapContextProps {
  apiKey: string;
  libraries?: string[];
  version: string;
  mapId: string;
  mapTypeId: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}