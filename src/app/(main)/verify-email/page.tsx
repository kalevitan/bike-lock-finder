"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResend = async () => {
    if (!user) {
      setError("You must be logged in to resend a verification email.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await sendEmailVerification(user);
      setSuccess("A new verification email has been sent to your address.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary-gray)]/20 flex items-center justify-center">
            <Mail className="w-10 h-10 text-[var(--primary-white)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--primary-white)]">
            Verify Your Email
          </h1>
          <p className="text-[var(--primary-white)] text-lg">
            A verification link has been sent to your email address. Please
            click the link to activate your account.
          </p>
          <p className="text-sm text-[var(--primary-gray)]">
            (You may need to check your spam folder)
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

        <div className="flex flex-col gap-4">
          <button
            onClick={handleResend}
            disabled={isSubmitting}
            className="button button--secondary"
          >
            {isSubmitting ? "Sending..." : "Resend Verification Email"}
          </button>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-[var(--primary-gray)] hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
