"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { sendEmailVerification, updateEmail } from "firebase/auth";
import Loading from "@/app/loading";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyEmail() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get the new email from URL if it exists
  const newEmail = searchParams.get("newEmail");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const checkVerification = async () => {
      if (!user) return;

      try {
        await user.reload();
        if (user.emailVerified) {
          setSuccess("Email verified successfully!");
          if (newEmail) {
            try {
              await updateEmail(user, newEmail);
              setSuccess("Email updated and verified successfully!");
            } catch (err: any) {
              if (err.code === "auth/requires-recent-login") {
                setError(
                  "Please sign out and sign in again to update your email."
                );
              } else {
                setError(err.message);
              }
            }
          }
          setTimeout(() => {
            router.push("/account");
          }, 2000);
        }
      } catch (err: any) {
        // Ignore token refresh errors as they don't affect functionality
        if (
          err.code ===
          "auth/requests-to-this-api-securetoken.googleapis.com-method-google.identity.securetoken.v1.securetoken.granttoken-are-blocked"
        ) {
          // This is a development-only error, we can safely ignore it
          return;
        }
        console.error("Error checking verification:", err);
        // Don't show an error message for token refresh issues
        // The verification status will be checked again when the user clicks the verification link
      }
    };

    checkVerification();
  }, [user, newEmail, router]);

  const handleResendVerification = async () => {
    if (!user) return;

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email${
          newEmail ? `?newEmail=${encodeURIComponent(newEmail)}` : ""
        }`,
      });
      setSuccess("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      console.error("Error sending verification email:", err);
      if (err.code === "auth/too-many-requests") {
        setError(
          "Too many verification emails sent. Please wait a few minutes before trying again."
        );
      } else {
        setError("Failed to send verification email. Please try again later.");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center">
          Verify Your Email
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {!user.emailVerified && (
          <div className="flex flex-col items-center gap-4 p-6 bg-[var(--primary-light-gray)] rounded-lg border border-[var(--primary-gray)]">
            <div className="w-16 h-16 rounded-full bg-[var(--primary-gray)] flex items-center justify-center">
              <Mail className="w-8 h-8 text-[var(--primary-white)]" />
            </div>

            <div className="text-center">
              <p className="text-[var(--primary-white)] mb-2">
                Please verify your email address to continue.
              </p>
              {newEmail && (
                <p className="text-[var(--primary-white)] text-sm">
                  After verifying, your email will be updated to:{" "}
                  <span className="font-medium">{newEmail}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleResendVerification}
              disabled={isSending}
              className="button text-[var(--primary-white)] w-full"
            >
              {isSending ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
