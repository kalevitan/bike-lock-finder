import { Metadata } from 'next';
import { Viewport } from 'next';
import { MapProvider } from '../contexts/MapProvider';
import { ModalProvider } from '../contexts/ModalProvider';
import { MarkerProvider } from '../contexts/MarkerProvider';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AuthProvider } from '@/contexts/AuthProvider';
import './global.css';

export const metadata: Metadata = {
  title: 'BikeLock Finder',
  description: 'An app to find or add bike locking stations around town.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body>
        <AuthProvider>
          <MapProvider>
            <MarkerProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </MarkerProvider>
          </MapProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}