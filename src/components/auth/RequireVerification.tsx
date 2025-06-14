"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";

interface RequireVerificationProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RequireVerification({
  children,
  redirectTo = "/verify-email",
}: RequireVerificationProps) {
  const { user, isLoading, isVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !isVerified) {
      router.push(redirectTo);
    }
  }, [isLoading, user, isVerified, router, redirectTo]);

  if (isLoading) {
    return <Loading />;
  }

  if (user && !isVerified) {
    return null;
  }

  return <>{children}</>;
}
