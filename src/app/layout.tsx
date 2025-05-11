import { Metadata } from 'next';
import { Viewport } from 'next';
import { MapProvider } from '../contexts/MapContext';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import './global.css';

export const metadata: Metadata = {
  title: 'BikeLock Finder',
  description: 'An app to find or add bike locking stations around town.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body>
        <MapProvider>{children}</MapProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}