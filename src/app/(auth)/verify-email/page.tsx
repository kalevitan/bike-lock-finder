"use client";

import { useAuth } from "@/contexts/AuthProvider";
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
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-lg">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-[var(--primary-white)] text-xl font-light leading-relaxed">
            Find and share secure places
            <br />
            to lock your bike
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[var(--primary-white)] rounded-2xl shadow-2xl p-8 border border-[var(--steel-blue)]/20">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--accent-mint)] to-[var(--primary-purple)] flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[var(--primary-gray)]">
                Verify Your Email
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] rounded-full mx-auto"></div>
              <p className="text-[var(--primary-gray)] text-base leading-relaxed">
                A verification link has been sent to your email address. Please
                click the link to activate your account.
              </p>
              <p className="text-sm text-[var(--primary-gray)]/60 bg-gray-50 px-4 py-2 rounded-lg">
                💡 Don't forget to check your spam folder
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--deep-purple)] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Sending..." : "Resend Verification Email"}
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full text-[var(--primary-purple)] hover:text-[var(--deep-purple)] font-medium py-2 transition-colors duration-200"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
