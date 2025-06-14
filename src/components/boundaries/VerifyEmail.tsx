"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VerifyEmailProps {
  children: React.ReactNode;
  className?: string;
  redirectOnly?: boolean;
}

function DefaultVerifyEmail({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/verify-email"
      className={`group flex items-center gap-3 p-3 rounded-lg bg-[var(--primary-light-gray)] border border-[var(--primary-gray)] hover:bg-[var(--primary-gray)] transition-all duration-200 ${className}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-gray)] flex items-center justify-center group-hover:bg-[var(--primary-light-gray)] transition-colors">
        <Mail className="w-4 h-4 text-[var(--primary-white)]" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[var(--primary-white)] text-sm font-medium">
          Verify your email
        </p>
        <p className="text-[var(--primary-white)] text-xs opacity-80">
          Click to complete verification
        </p>
      </div>
      <AlertCircle className="w-4 h-4 text-[var(--primary-white)] ml-auto opacity-50" />
    </Link>
  );
}

export default function VerifyEmail({
  children,
  className,
  redirectOnly = false,
}: VerifyEmailProps) {
  const { user, isVerified } = useAuth();
  const router = useRouter();

  // If no user or user is verified, show the children
  if (!user || isVerified) {
    return <>{children}</>;
  }

  // If redirectOnly is true, redirect to verify-email page
  if (redirectOnly) {
    router.push("/verify-email");
    return null;
  }

  // Otherwise show the verification prompt
  return <DefaultVerifyEmail className={className} />;
}
