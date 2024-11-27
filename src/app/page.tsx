'use client';

import { useEffect, useState } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import MarkerList from '@/src/components/MarkerList';
import Header from '@/src/components/header/Header';
import { useMapContext } from './context/MapContext';
import { getLocation } from '@/src/utils/locationutils';
import Sidebar from "@/src/components/sidebar/Sidebar";
import AddPoint from "@/src/components/AddPoint";
import { MarkerProvider, useMarkerContext } from './context/MarkerContext';

const Points: React.FC = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateLocation = () => {
    getLocation()
      .then((location) => {
        setLocation(location);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSearch = (query: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(query);
  };

  const handleMarkerClick = (id: string) => {
    setOpenMarkerId(id);
  };

  const handleMarkerClose = (id: string) => {
    if (openMarkerId === id) {
      setOpenMarkerId(null);
    }
  };

  return (
    <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
      <div className="flex flex-col">
        <Header onSearch={handleSearch}/>
        <Sidebar updateLocation={updateLocation} openModal={() => setIsModalOpen(true)}/>
        <main className="flex place-content-center md:pl-72">
          {error && <div className="error fixed bg-red-50 mb-8 p-4">{error}</div>}
          <div id="map">
            <Map
              mapId={mapId}
              mapTypeId={mapTypeId}
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              gestureHandling={'greedy'}
              disableDefaultUI>

              <MarkerProvider>
                <MapContent
                  location={location}
                  place={selectedPlace}
                  openMarkerId={openMarkerId}
                  onMarkerClick={handleMarkerClick}
                  onMarkerClose={handleMarkerClose}
                />
              </MarkerProvider>

            </Map>
          </div>
        </main>
      </div>
      {isModalOpen && <AddPoint closeModal={() => setIsModalOpen(false)} />}
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
}: {
  location: { lat: number; lng: number } | null,
  place: google.maps.places.PlaceResult | null,
  openMarkerId: string | null,
  onMarkerClick: (id: string) => void,
  onMarkerClose: (id: string) => void,
}) => {
  const map = useMap();
  const { markers } = useMarkerContext();

  useEffect(() => {
    if (!map || (!location && !place)) return;

    console.log(place, "Place");

    if (location) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(location);
      map.fitBounds(bounds);

      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        map.setZoom(map.getZoom()! - 1);
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    } else if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else if (place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  }, [map, location, place]);

  return <MarkerList markerData={markers} openMarkerId={openMarkerId} onMarkerClick={onMarkerClick} onMarkerClose={onMarkerClose}/>;
};
