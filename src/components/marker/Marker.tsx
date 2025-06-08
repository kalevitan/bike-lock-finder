import React, { useEffect, useState } from 'react';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MarkerProps } from '@/interfaces/markers';
import classNames from 'classnames';
import './marker.css';
import MarkerPin from './MarkerPin';

export function Marker({
  isOpen,
  onClick,
  onClose,
  onEditPoint,
  ...markerData
}: MarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [hovered, setHovered] = useState(false);
  const position = { lat: parseFloat(markerData.latitude), lng: parseFloat(markerData.longitude) };

  useEffect(() => {
    if (marker) {
      marker.addEventListener('mouseover', () => setHovered(true));
      marker.addEventListener('mouseout', () => setHovered(false));
      marker.addEventListener('gmp-click', () => {
        if (isOpen) {
          onClose();
        } else {
          onClick();
        }
      });

      marker.style.zIndex = isOpen ? '1' : '0';
    }

    return () => {
      if (marker) {
        marker.removeEventListener('mouseover', () => setHovered(true));
        marker.removeEventListener('mouseout', () => setHovered(false));
        marker.removeEventListener('gmp-click', () => {
          if (isOpen) {
            onClose();
          } else {
            onClick();
          }
        });
      }
    };
  }, [marker, isOpen, onClick, onClose]);

  return (
    <AdvancedMarker
      ref={markerRef}
      onClick={onClick}
      position={position}
      title={markerData.title}
      className={classNames('bike-lock-marker', {clicked: isOpen, hovered})}>
      <MarkerPin isOpen={isOpen} markerData={markerData as MarkerProps} onEditPoint={onEditPoint} />
    </AdvancedMarker>
  );
};