import { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { MarkerDetails } from './marker-details/MarkerDetails';
import classNames from 'classnames';

interface MarkerProps {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
}

const Marker: React.FC<MarkerProps> = (props) => {
  // const [infowindowOpen, setInfowindowOpen] = useState(false);
  // const [markerRef, marker] = useAdvancedMarkerRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const position = {
    lat: parseFloat(props.latitude),
    lng: parseFloat(props.longitude)
  };

  const renderCustomPin = () => {
    return (
      <>
        <button className="close">
          <span>X</span>
        </button>
        <div className="marker-pin">
          <div className="marker-pin-inner">
            <MarkerDetails details={props}/>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdvancedMarker
        // ref={markerRef}
        onClick={() => setClicked(!clicked)}
        position={position}
        title={props.title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={classNames('bike-marker', {clicked, hovered})}>
        {renderCustomPin()}
      </AdvancedMarker>
      {/* {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          className='info'
          maxWidth={320}
          shouldFocus={true}
          onCloseClick={() => setInfowindowOpen(false)}>
          {renderCustomPin()}
        </InfoWindow>
      )} */}
    </>
  );
};

export default Marker;