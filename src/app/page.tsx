'use client';

import { useCallback, useEffect, useState } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import MarkerList from '@/src/components/marker/MarkerList';
import Header from '@/src/components/header/Header';
import { useMapContext } from '@/src/context/MapContext';
import { getLocation } from '@/src/utils/locationutils';
import Sidebar from "@/src/components/sidebar/Sidebar";
import AddPoint from "@/src/components/addpoint/AddPoint";
import { MarkerProvider, useMarkerContext } from '@/src/context/MarkerContext';
import { MarkerProps } from '@/src/interfaces/markers';

const Points: React.FC = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPointData, setEditPointData] = useState<MarkerProps | null>(null);

  const updateLocation = useCallback(() => {
    getLocation()
      .then((location) => {
        setLocation(location);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleSearch = useCallback((query: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(query);
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setOpenMarkerId(id);
  }, []);

  const handleMarkerClose = useCallback((id: string) => {
    if (openMarkerId === id) {
      setOpenMarkerId(null);
    }
  }, [openMarkerId]);

  const handleMapClick = useCallback(() => {
    setOpenMarkerId(null);
  }, []);

  const openModal = useCallback((editPointData: MarkerProps | null = null) => {
    setEditPointData(null);
    setIsModalOpen(true);
  }, []);

  const handleEditPoint =  useCallback((pointData: MarkerProps) => {
    if (!pointData.id) throw new Error("Point data must include an ID for editing.");
    setEditPointData(pointData);
    setIsModalOpen(true);
  }, []);

  const handleRecenter = useCallback(() => {
    const cords = { ...defaultCenter, zoom: defaultZoom };
    setLocation(cords);
  }, [defaultCenter, defaultZoom]);

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
                  onClick={handleMapClick}>

                  <MapContent
                    location={location}
                    place={selectedPlace}
                    openMarkerId={openMarkerId}
                    onMarkerClick={handleMarkerClick}
                    onMarkerClose={handleMarkerClose}
                    onEditPoint={handleEditPoint}
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

const MapContent = ({
  location,
  place,
  openMarkerId,
  onMarkerClick,
  onMarkerClose,
  onEditPoint,
}: {
  location: { lat: number; lng: number; zoom?: number } | null,
  place: google.maps.places.PlaceResult | null,
  openMarkerId: string | null,
  onMarkerClick: (id: string) => void,
  onMarkerClose: (id: string) => void,
  onEditPoint: (pointData: MarkerProps) => void;
}) => {
  const map = useMap();
  const { markers, isLoading } = useMarkerContext();

  useEffect(() => {
    if (!map || !location) return;

    if (location) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(location);
      map.fitBounds(bounds);

      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (location.zoom) {
          map.setZoom(location.zoom);
        } else {
          map.setZoom(map.getZoom()! - 1);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    };
  }, [map, location]);

  useEffect(() => {
    if (!map || (!place)) return;

    if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
      const infoContent = `<p class="text-black">${place.geometry.location?.lat()}, ${place.geometry.location?.lng()}</p>`
      const infoWindow = new google.maps.InfoWindow({
        headerContent: `<h3 class="text-black font-bold">${place.name}</h3>`,
        content: infoContent,
        ariaLabel: "Info window",
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        title: place.name,
      });
      infoWindow.open({
        anchor: marker,
        map,
      });
      console.log(place.name, place.geometry.location?.lat(), place.geometry.location?.lng());
    } else if (place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  }, [map, place]);

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary-purple)]"></div>
          <p className="sr-only">Loading...</p>
        </div>
      )}
      <MarkerList
        markerData={markers}
        openMarkerId={openMarkerId}
        onMarkerClick={onMarkerClick}
        onMarkerClose={onMarkerClose}
        onEditPoint={onEditPoint}
      />
    </>
  );
};
