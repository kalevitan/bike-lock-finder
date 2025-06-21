"use client";

import { AuthProvider } from "@/contexts/AuthProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override the HTML overflow hidden for auth pages
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    return () => {
      // Restore the original overflow settings when leaving auth pages
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AuthProvider>
      <div className="bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)] min-h-screen">
        {/* Minimal Auth Header */}
        <header className="flex items-center justify-between p-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-[var(--primary-white)] hover:text-[var(--accent-mint)] transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Dockly</span>
          </Link>

          <Link href="/" className="flex items-center">
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] bg-clip-text text-transparent">
              Dockly
            </span>
          </Link>
        </header>

        {/* Auth Content */}
        <main className="px-4 pb-8">
          {children}
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-xs">
              © 2025 Dockly. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
