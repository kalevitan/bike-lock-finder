import React, { use, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMarkerContext } from "@/contexts/MarkerContext";
import { MapContentProps } from "@/interfaces/map";
import MarkerList from "@/components/marker/MarkerList";

export const MapContent: React.FC<MapContentProps> = ({
  location,
  place,
  openMarkerId,
  onEditPoint,
  onMarkerClick,
  onMarkerClose,
}) => {
  const map = useMap();
  const { markers, isLoading } = useMarkerContext();

  useEffect(() => {
    if (map) {
      const bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);
    }
  }, [map]);

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
          map.setZoom(map.getZoom()! - 2);
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
      // const infoContent = `
      //   <div class="text-black">
      //     <h3>${place.name}</h3>
      //     <p>${place.geometry.location?.lat()}, ${place.geometry.location?.lng()}</p>
      //   </div>`
      // const infoWindow = new google.maps.InfoWindow({
      //   content: infoContent,
      //   ariaLabel: "Info window",
      // });
      // const marker = new google.maps.marker.AdvancedMarkerElement({
      //   position: place.geometry.location,
      //   map,
      //   title: place.name,
      // });
      // infoWindow.open({
      //   anchor: marker,
      //   map,
      // });
    } else if (place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(14);
    }
  }, [map, place]);

  useEffect(() => {
    if (!map || !openMarkerId) return;

    const openMarker = markers.find(marker => marker.id === openMarkerId);
    if (!openMarker) return;

    const markerPosition = {
      lat: parseFloat(openMarker.latitude),
      lng: parseFloat(openMarker.longitude)
    };

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(markerPosition);

    map.panTo(bounds.getCenter());
  }, [map, openMarkerId, markers]);

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
}

export default MapContent;