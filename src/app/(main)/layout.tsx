"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MapProvider } from "@/contexts/MapProvider";

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {pathname === "/" ? <MapProvider>{children}</MapProvider> : children}
        <div className="text-center py-6 text-white/50 text-sm">
          © {currentYear} Dockly. All rights reserved.
        </div>
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}
