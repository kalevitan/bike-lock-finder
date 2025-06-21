"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const libraries = ["marker", "places"];
  const version = "beta";

  return (
    <APIProvider apiKey={apiKey} libraries={libraries} version={version}>
      {children}
    </APIProvider>
  );
}
