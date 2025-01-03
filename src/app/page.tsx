'use client';

import { useCallback, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Header from '@/components/header/Header';
import { useMapContext } from '@/context/MapContext';
import { getLocation } from '@/utils/locationutils';
import Sidebar from "@/components/sidebar/Sidebar";
import AddPoint from "@/components/addpoint/AddPoint";
import MapContent from "@/components/map/MapContent";
import { MarkerProvider } from '@/context/MarkerContext';
import { MarkerProps } from '@/interfaces/markers';

const Points: React.FC = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPointData, setEditPointData] = useState<MarkerProps | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);

  const updateLocation = useCallback(() => {
    getLocation()
      .then(setLocation)
      .catch((error) => setError(error.message));
  }, []);

  const openModal = useCallback((editPointData: MarkerProps | null = null) => {
    setEditPointData(null);
    setIsModalOpen(true);
  }, []);

  const handleSearch = useCallback((query: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(query);
  }, []);

  const handleRecenter = useCallback(() => {
    const cords = { ...defaultCenter, zoom: defaultZoom };
    setLocation(cords);
  }, [defaultCenter, defaultZoom]);

  const handleEditPoint =  useCallback((pointData: MarkerProps) => {
    if (!pointData.id) throw new Error("Point data must include an ID for editing.");
    setEditPointData(pointData);
    setIsModalOpen(true);
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setOpenMarkerId(id);
  }, []);

  const handleMarkerClose = useCallback((id: string) => {
    if (openMarkerId === id) {
      setOpenMarkerId(null);
    }
  }, [openMarkerId]);

  return (
    <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
      <MarkerProvider>
        <div className="grid-layout">
          <Header onSearch={handleSearch} onRecenter={handleRecenter}/>
          <Sidebar updateLocation={updateLocation} openModal={openModal}/>
          <main className="relative">
            <div className="absolute w-full h-full">
              {error && <div className="error fixed bg-red-50 mb-8 p-4">{error}</div>}
              <div id="map" className="w-full h-full">
                <Map
                  mapId={mapId}
                  mapTypeId={mapTypeId}
                  defaultCenter={defaultCenter}
                  defaultZoom={defaultZoom}
                  gestureHandling={'greedy'}
                  disableDefaultUI
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
        {isModalOpen && (
          <AddPoint closeModal={() => setIsModalOpen(false)} pointData={editPointData}/>
        )}
      </MarkerProvider>
    </APIProvider>
  )
}

export default Points;
