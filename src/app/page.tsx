'use client';

import { useCallback, useEffect, useState } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import MarkerList from '@/src/components/MarkerList';
import Header from '@/src/components/header/Header';
import { useMapContext } from '@/src/context/MapContext';
import { getLocation } from '@/src/utils/locationutils';
import Sidebar from "@/src/components/sidebar/Sidebar";
import AddPoint from "@/src/components/AddPoint";
import { MarkerProvider, useMarkerContext } from '@/src/context/MarkerContext';
import { MarkerProps } from '@/src/interfaces/markers';

const Points: React.FC = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
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

  return (
    <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
      <MarkerProvider>
        <div className="flex flex-col">
          <Header onSearch={handleSearch}/>
          <Sidebar updateLocation={updateLocation} openModal={openModal}/>
          <main className="flex place-content-center md:pl-72">
            {error && <div className="error fixed bg-red-50 mb-8 p-4">{error}</div>}
            <div id="map">
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
  location: { lat: number; lng: number } | null,
  place: google.maps.places.PlaceResult | null,
  openMarkerId: string | null,
  onMarkerClick: (id: string) => void,
  onMarkerClose: (id: string) => void,
  onEditPoint: (pointData: MarkerProps) => void;
}) => {
  const map = useMap();
  const { markers } = useMarkerContext();

  useEffect(() => {
    if (!map || !location) return;

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
    };
  }, [map, location]);

  useEffect(() => {
    if (!map || (!place)) return;

    if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
      const infoContent = `<p class="text-black">${place.geometry.location?.lat()}, ${place.geometry.location?.lng()}</p>`
      const infowindow = new google.maps.InfoWindow({
        content: infoContent,
        ariaLabel: "Info window",
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        title: place.name,
      });
      infowindow.open({
        anchor: marker,
        map,
      });
      console.log(place.geometry.location?.lat(), place.geometry.location?.lng());
    } else if (place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  }, [map, place]);

  return <MarkerList markerData={markers} openMarkerId={openMarkerId} onMarkerClick={onMarkerClick} onMarkerClose={onMarkerClose} onEditPoint={onEditPoint}/>;
};
