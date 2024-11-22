import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Points from './routes/Points';
import { loader as pointsLoader } from './utils/dataloader';
import PointDetails, { loader as pointDetailsLoader } from './routes/PointDetails';
import AddPoint, { action as addPointAction } from './routes/AddPoint';
import About from './routes/About';
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
      {
        path: '/about',
        element: <About />,
      }
  ] },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapProvider>
      <RouterProvider router={router} />
    </MapProvider>
  </StrictMode>,
);
