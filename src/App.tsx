import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { MarkerList } from './components/MarkerList';
import { AddPoint } from './components/AddPoint';
import './App.css'

const App = () => {
  return (
    <>
      <h1 className="font-bold">BikeLock</h1>

      <div id="map">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
          <Map
            mapId={'868b5b48f399fab4'}
            defaultCenter={{lat: 35.60, lng: -82.55}}
            defaultZoom={15}
            gestureHandling={'greedy'}
            disableDefaultUI>

            <MarkerList />

          </Map>
        </APIProvider>
      </div>
    </>
  )
}

export default App
