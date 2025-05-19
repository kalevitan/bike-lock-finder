'use client';

import { useCallback, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Header from '@/components/header/Header';
import { useMapContext } from '@/contexts/MapProvider';
import { getLocation } from '@/utils/locationutils';
import Sidebar from "@/components/sidebar/Sidebar";
import AddLock from "@/components/addlock/AddLock";
import MapContent from "@/components/map/MapContent";
import { MarkerProps } from '@/interfaces/markers';
import { useModal } from '@/contexts/ModalProvider';
import { useIsMobile } from './hooks/useIsMobile';

export default function Points() {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editPointData, setEditPointData] = useState<MarkerProps | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const { openModal } = useModal();
  const isMobile = useIsMobile();
  const updateLocation = useCallback(() => {
    getLocation()
      .then(setLocation)
      .catch((error) => setError(error.message));
  }, []);

  const handleSearch = useCallback((query: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(query);
  }, []);

  const handleRecenter = useCallback(() => {
    const cords = { ...defaultCenter, zoom: defaultZoom };
    setLocation(cords);
  }, [defaultCenter, defaultZoom]);

  const handleEditPoint = useCallback((pointData: MarkerProps) => {
    if (!pointData.id) throw new Error("Point data must include an ID for editing.");
    setEditPointData(pointData);
    openModal(<AddLock pointData={pointData} formMode="edit" />, 'Edit Lock');
  }, [openModal]);

  const handleMarkerClick = useCallback((id: string) => {
    setOpenMarkerId(id);
  }, []);

  const handleMarkerClose = useCallback(() => {
    setOpenMarkerId(null);
  }, []);

  const handleAddLock = useCallback(() => {
    setEditPointData(null);
    openModal(<AddLock formMode="add" />, 'Add Lock');
  }, [openModal]);

  return (
    <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
      <div className="">
        {isMobile && (
          <Header onSearch={handleSearch} onRecenter={handleRecenter}/>
        )}

        <Sidebar updateLocation={updateLocation} onAddLock={handleAddLock} onSearch={handleSearch} onRecenter={handleRecenter}/>
        <main role="main" className="">
          <div className="absolute w-full h-full">
            {error && <div className="error fixed bg-red-50 mb-8 p-4">{error}</div>}
            <div id="map" className="w-full h-full">
              <Map
                mapId={mapId}
                mapTypeId={mapTypeId}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                fullscreenControl={true}
                onClick={() => setOpenMarkerId(null)}>
                <MapContent
                  location={location}
                  place={selectedPlace}
                  onEditPoint={handleEditPoint}
                  openMarkerId={openMarkerId}
                  onMarkerClick={handleMarkerClick}
                  onMarkerClose={handleMarkerClose}
                />
              </Map>
            </div>
          </div>
        </main>
      </div>
    </APIProvider>
  )
}