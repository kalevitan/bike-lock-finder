import { APIProvider, Map } from '@vis.gl/react-google-maps';
import MarkerList from '../components/MarkerList';
import { Outlet } from 'react-router-dom';
import { useMapContext } from '../context/MapContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Points = () => {
  const { apiKey, libraries, version, mapId, mapTypeId, defaultCenter, defaultZoom } = useMapContext();

  return (
    <>
      <Outlet />
      <main className="flex place-content-center">
        <div id="map">
          <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
            <Map
              mapId={mapId}
              mapTypeId={mapTypeId}
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              gestureHandling={'greedy'}
              disableDefaultUI>

              <MarkerList />

            </Map>
          </APIProvider>
        </div>
      </main>
    </>
  )
}

export default Points

export const loader = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    const locations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(locations);
    return locations;
  } catch (e) {
    console.error('Error getting documents: ', e);
    return [];
  }
}