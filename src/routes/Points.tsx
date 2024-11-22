import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import MarkerList from '../components/MarkerList';
import { Outlet } from 'react-router-dom';
import { useMapContext } from '../context/MapContext';
import { getLocation } from '../utils/locationutils';
import Sidebar from "../components/sidebar/Sidebar";

const Points = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);

  const updateLocation = () => {
    getLocation()
      .then((location) => {
        setLocation(location);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    updateLocation();
  }, []);

  const handleMarkerClick = (id: string) => {
    setOpenMarkerId(id);
  };

  const handleMarkerClose = (id: string) => {
    if (openMarkerId === id) {
      setOpenMarkerId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <Sidebar updateLocation={updateLocation}/>
        <Outlet />
        <main className="flex place-content-center md:pl-72">
          {error && <div className="error fixed bg-red-50 mb-8 p-4">{error}</div>}
          <div id="map">
            <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
              <Map
                mapId={mapId}
                mapTypeId={mapTypeId}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                gestureHandling={'greedy'}
                disableDefaultUI>

                <MapContent location={location} openMarkerId={openMarkerId} onMarkerClick={handleMarkerClick} onMarkerClose={handleMarkerClose}/>

              </Map>
            </APIProvider>
          </div>
        </main>
      </div>
    </>
  )
}

export default Points

const MapContent = ({ location, openMarkerId, onMarkerClick, onMarkerClose }: { location: { lat: number; lng: number } | null, openMarkerId: string | null, onMarkerClick: (id: string) => void, onMarkerClose: (id: string) => void }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !location) return;

    // const service = new google.maps.places.PlacesService(map);
    const bounds = new google.maps.LatLngBounds();

    bounds.extend(location);
    map.fitBounds(bounds);

    const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      map.setZoom(map.getZoom()! - 2);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, location]);

  return <MarkerList openMarkerId={openMarkerId} onMarkerClick={onMarkerClick} onMarkerClose={onMarkerClose} />;
};
