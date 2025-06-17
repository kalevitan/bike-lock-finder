import { Metadata } from "next";
import { Viewport } from "next";
import { MapProvider } from "../contexts/MapProvider";
import { ModalProvider } from "../contexts/ModalProvider";
import { MarkerProvider } from "../contexts/MarkerProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthProvider";
import "./global.css";

import { Urbanist, Work_Sans } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dockley | Find Safe Bike Lock Stations Near You",
  description:
    "Find and share secure bike lock stations in your city. Dockley helps cyclists ride with confidence by mapping reliable lock spots—anywhere you go.",
};

export const viewport: Viewport = {
  width: "device-width",
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
      <body className={`${urbanist.variable} ${workSans.variable}`}>
        <AuthProvider>
          <MapProvider>
            <MarkerProvider>
              <ModalProvider>{children}</ModalProvider>
            </MarkerProvider>
          </MapProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
