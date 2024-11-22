import React, { useEffect, useState } from 'react';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MarkerDetails } from './marker-details/MarkerDetails';
import { MarkerProps } from '../types/types';
// import { BikeIcon } from '../assets/icons/bike-icon';
import classNames from 'classnames';

const Marker: React.FC<MarkerProps> = (props) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [hovered, setHovered] = useState(false);

  const position = { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) };

  useEffect(() => {
    if (marker) {
      marker.addEventListener('mouseover', () => setHovered(true));
      marker.addEventListener('mouseout', () => setHovered(false));
      marker.addEventListener('gmp-click', (e) => {
        // Set a prop to close the marker if it's open, otherwise open it.
        if (props.isOpen) {
          props.onClose();
        } else {
          props.onClick();
        }
      })

      // Make sure the marker is on top when clicked.
      if (props.isOpen) {
        marker.style.zIndex = '1';
      } else {
        marker.style.zIndex = '0';
      }
    }
  }, [marker, props]);

  const renderCustomPin = () => {
    return (
      <>
        <div className="custom-pin">
          <button className="close-button">
            <span className="material-symbols-outlined"> close </span>
          </button>

          <div className="image-container">
            {/* <BikeLockImageGallery /> */}
            <img src="/images/bike-lock.jpeg" className="image" alt="placeholder" />
            <span className="icon">
              {/* <BikeIcon /> */}
            </span>
          </div>

          <MarkerDetails details={props} />
        </div>

        <div className="tip" />
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