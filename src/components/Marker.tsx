import React, { useEffect, useState } from 'react';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MarkerDetails } from './marker-details/MarkerDetails';
import { MarkerProps as MarkerData } from '@/src/types/types';
import classNames from 'classnames';

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
        // Set a prop to close the marker if it's open, otherwise open it.
        if (props.isOpen) {
          props.onClose();
        } else {
          props.onClick();
          // Refit the bounds to include the marker.
          // console.log(position);
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
    // console.log(props);
    return (
      <>
        <div className="custom-pin">
          <button className="close-button" onClick={(e) => { e.stopPropagation(); props.onClose(); }}>
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="image-container">
            {/* <BikeLockImageGallery /> */}
            <img src="/images/bike-lock.jpeg" className="image" alt="placeholder" />
            <span className="icon">
              {/* <BikeIcon /> */}
            </span>
          </div>

          <MarkerDetails details={props} onEdit={(pointData) => props.onEditPoint({ ...props, ...pointData })} />
        </div>

        {/* <div className="tip" /> */}
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