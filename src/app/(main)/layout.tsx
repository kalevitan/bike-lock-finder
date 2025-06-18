"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MapProvider } from "@/contexts/MapProvider";
import { toast } from "sonner";

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Show toast for email verification
  const showVerificationToast = () => {
    toast(
      "Please verify your email. Check your inbox for the verification link.",
      { duration: 5000 }
    );
  };

  // Check if we should show the verification toast
  if (pathname === "/account" && typeof window !== "undefined") {
    const hasShownToast = sessionStorage.getItem("hasShownVerificationToast");
    if (!hasShownToast) {
      showVerificationToast();
      sessionStorage.setItem("hasShownVerificationToast", "true");
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 mt-20 px-8 md:px-12 md:py-16 overflow-y-auto">
        {pathname === "/" ? <MapProvider>{children}</MapProvider> : children}
      </main>
      <footer className="text-center py-6 text-neutral-500 text-sm">
        © {currentYear} Dockly. All rights reserved.
      </footer>
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
