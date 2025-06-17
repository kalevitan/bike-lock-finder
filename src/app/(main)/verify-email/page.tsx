"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPendingRegistration } from "@/lib/auth";
import Loading from "@/app/loading";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("Invalid verification link");
        setIsVerifying(false);
        return;
      }

      try {
        const email = await verifyPendingRegistration(token);
        setSuccess("Email verified successfully!");
        // Redirect to complete registration after a short delay
        setTimeout(() => {
          router.push(
            `/complete-registration?email=${encodeURIComponent(email)}`
          );
        }, 2000);
      } catch (err: any) {
        setError(err.message || "Failed to verify email");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (isVerifying) {
    return <Loading />;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-[var(--primary-white)]">
            Verify your email
          </h1>
          <p className="text-[var(--primary-white)] text-lg">
            Please wait while we verify your email address.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-950/50 border border-green-800/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-200">{success}</p>
          </div>
        )}

        {!error && !success && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-6 p-8 bg-[var(--primary-light-gray)]/10 rounded-lg border border-[var(--primary-gray)]/20">
              <div className="w-20 h-20 rounded-full bg-[var(--primary-gray)]/20 flex items-center justify-center">
                <Mail className="w-10 h-10 text-[var(--primary-white)]" />
              </div>
              <div className="flex flex-col gap-3 text-center">
                <h2 className="text-xl font-semibold text-[var(--primary-white)]">
                  Verifying your email
                </h2>
                <p className="text-[var(--primary-gray)] text-lg">
                  Please wait while we verify your email address...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
