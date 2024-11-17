import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { MarkerDetails } from './marker-details/MarkerDetails';

interface MarkerProps {
  title: string;
  latitude: string;
  longitude: string;
  description: string;
}

const Marker: React.FC<MarkerProps> = (props) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // console.log(markerRef);

  const position = { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) };

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.addListener('mouseover', () => setHovered(true));
      markerRef.current.addListener('mouseout', () => setHovered(false));
    }
  }, [markerRef, clicked]);

  const renderCustomPin = () => {
    return (
      <>
        <div className={`marker-pin ${hovered ? 'hovered' : ''}`}>
          <div className="marker-pin-inner">
            <MarkerDetails details={props} />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={position}
        title={props.title} />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          className='info marker-details'
          maxWidth={320}
          shouldFocus={true}
          headerContent={<h2 className="text-black">{props.title}</h2>}
          onCloseClick={() => setInfowindowOpen(false)}>
          {renderCustomPin()}
        </InfoWindow>
      )}
    </>
  );
};

export default Marker;