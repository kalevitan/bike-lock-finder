import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Points, { loader as pointsLoader } from './routes/Points';
import PointDetails, { loader as pointDetailsLoader } from './routes/PointDetails';
import AddPoint, { action as addPointAction } from './routes/AddPoint';
import RootLayout from './routes/RootLayout';
import './index.css';
import { MapProvider } from './context/MapContext';

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Points />,
        loader: pointsLoader,
        children: [
          { path: '/add-point', element: <AddPoint />, action: addPointAction },
          { path: '/point/:id', element: <PointDetails />, loader: pointDetailsLoader },
        ]
      },
  ] },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapProvider>
      <RouterProvider router={router} />
    </MapProvider>
  </StrictMode>,
);
