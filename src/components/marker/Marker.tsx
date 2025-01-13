import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MarkerDetails } from './MarkerDetails';
import { MarkerProps as MarkerData } from '@/interfaces/markers';
import classNames from 'classnames';
import { BikeLockIcon } from '@/components/icons/bike-lock-icon';
import './marker.css';

interface MarkerProps extends MarkerData {
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  onEditPoint: (pointData: MarkerData) => void;
}

const Marker: React.FC<MarkerProps> = ({
  isOpen,
  onClick,
  onClose,
  onEditPoint,
  ...markerData
}) => {
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
      <div className="custom-pin">
        <div className="image-container">
          <div className="w-full h-full relative">
            <Image
              src="/images/bike-lock.jpeg"
              width={300}
              height={300}
              sizes="50vw"
              className="image"
              alt={`Bike lock location: ${markerData.title}`}
              priority={isOpen}
            />
          </div>
          <span className="icon">
            <BikeLockIcon />
          </span>
        </div>

        <MarkerDetails
          details={markerData}
          onEdit={(onEditPoint)}
        />

        <div className="triangle" />
      </div>
    </AdvancedMarker>
  );
};

export default Marker;