import { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const Marker = (props) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{lat: parseFloat(props.lat), lng: parseFloat(props.lon)}}
        title={props.name}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          className='info'
          maxWidth={200}
          shouldFocus={true}
          onCloseClick={() => setInfowindowOpen(false)}>
          {props.description}
        </InfoWindow>
      )}
    </>
  );
};
