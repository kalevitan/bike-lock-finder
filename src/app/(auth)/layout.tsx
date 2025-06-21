"use client";

import { AuthProvider } from "@/contexts/AuthProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)]">
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
        <main className="px-4 pb-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
