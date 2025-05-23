import React, { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMarkerContext } from "@/contexts/MarkerProvider";
import { MapContentProps } from "@/interfaces/map";
import MarkerList from "@/components/marker/MarkerList";
import Loading from "@/app/loading";
import { LocationMarker } from "../marker/LocationMarker";

export default function MapContent({
  location,
  place,
  openMarkerId,
  onEditPoint,
  onMarkerClick,
  onMarkerClose,
}: MapContentProps) {
  const map = useMap();
  const { markers, isLoading } = useMarkerContext();
  const searchMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

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
    if (!map || (!place)) {
      // Clear marker when place is null
      if (searchMarkerRef.current) {
        searchMarkerRef.current.map = null;
        searchMarkerRef.current = null;
      }
      return;
    }

    let marker: google.maps.marker.AdvancedMarkerElement | null = null;

    if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
      marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        title: place.name,
        content: LocationMarker(),
      });
    } else if (place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(14);
      marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        title: place.name,
        content: LocationMarker(),
      });
    }

    // Store the marker reference
    searchMarkerRef.current = marker;

    // Cleanup function to remove marker when place changes or component unmounts
    return () => {
      if (marker) {
        marker.map = null;
      }
    };
  }, [map, place]);

  useEffect(() => {
    if (!map || !openMarkerId) return;

    const openMarker = markers.find(marker => marker.id === openMarkerId);
    if (!openMarker) return;

    const markerPosition = {
      lat: parseFloat(openMarker.latitude),
      lng: parseFloat(openMarker.longitude)
    };

    // Calculate dynamic offset based on zoom level
    const currentZoom = map.getZoom() || 14;
    const zoomFactor = Math.pow(2, 14 - currentZoom); // Adjust offset based on zoom level
    const offsetLat = markerPosition.lat + (0.0025 * zoomFactor);
    const offsetPosition = {
      lat: offsetLat,
      lng: markerPosition.lng
    };

    // Pan to the offset position
    map.panTo(offsetPosition);
  }, [map, openMarkerId, markers]);

  return (
    <>
      {isLoading && <Loading />}
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