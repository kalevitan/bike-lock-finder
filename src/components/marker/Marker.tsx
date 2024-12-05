import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MarkerDetails } from './MarkerDetails';
import { MarkerProps as MarkerData } from '@/src/interfaces/markers';
import classNames from 'classnames';
import './marker.css';

interface MarkerProps extends MarkerData {
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  onEditPoint: (pointData: MarkerData) => void;
}

const Marker: React.FC<MarkerProps> = (props) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [hovered, setHovered] = useState(false);

  const position = { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) };

  useEffect(() => {
    if (marker) {
      marker.addEventListener('mouseover', () => setHovered(true));
      marker.addEventListener('mouseout', () => setHovered(false));
      marker.addEventListener('gmp-click', (e) => {
        if (props.isOpen) {
          props.onClose();
        } else {
          props.onClick();
        }
      });

      marker.style.zIndex = props.isOpen ? '1' : '0';
    }

    return () => {
      if (marker) {
        marker.removeEventListener('mouseover', () => setHovered(true));
        marker.removeEventListener('mouseout', () => setHovered(false));
        marker.removeEventListener('gmp-click', (e) => {
          if (props.isOpen) {
            props.onClose();
          } else {
            props.onClick();
          }
        });
      }
    };
  }, [marker, props]);

  const renderCustomPin = () => {
    return (
      <>
        <div className="custom-pin">
          <button className="close-button" onClick={(e) => { e.stopPropagation(); props.onClose(); }}>
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="image-container">
            {/* <BikeLockImageGallery /> */}
            <Image src="/images/bike-lock.jpeg" className="image" alt="placeholder" width={600} height={400} />
            <span className="icon">
              {/* <BikeIcon /> */}
            </span>
          </div>

          <MarkerDetails details={props} onEdit={(pointData) => props.onEditPoint({ ...props, ...pointData })} />

          <div className="triangle"></div>
        </div>
      </>
    );
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={props.onClick}
        position={position}
        title={props.title}
        className={classNames('bike-lock-marker', {clicked: props.isOpen, hovered})}>
        {renderCustomPin()}
      </AdvancedMarker>
    </>
  );
};

export default Marker;