"use client";

import RequireVerification from "@/components/auth/RequireVerification";
import Header from "@/components/header/Header";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isVerifyEmailPage = pathname === "/verify-email";

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 mt-20 px-8 md:px-12 md:py-16 overflow-y-auto">
        {isVerifyEmailPage ? (
          children
        ) : (
          <RequireVerification>{children}</RequireVerification>
        )}
      </main>
      <footer className="text-center py-6 text-neutral-500 text-sm">
        © {currentYear} BikeLock Finder. All rights reserved.
      </footer>
    </div>
  );
}
