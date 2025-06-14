"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { sendEmailVerification, signOut, updateEmail } from "firebase/auth";
import Loading from "@/app/loading";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function VerifyEmail() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
        // Reload the user to get the latest verification status
        await user.reload();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.push("/login");
          return;
        }

        // If there's a new email to update
        if (newEmail && newEmail !== currentUser.email) {
          try {
            await updateEmail(currentUser, newEmail);
            await sendEmailVerification(currentUser);
            setSuccess(
              "Email updated. Please check your inbox to verify your new email address."
            );
          } catch (err: any) {
            if (err.code === "auth/requires-recent-login") {
              setError("Please log out and log back in to update your email.");
            } else {
              setError("Failed to update email. Please try again.");
            }
          }
        }
        // If the user is now verified, redirect to account
        else if (currentUser.emailVerified) {
          router.push("/account");
        }
      } catch (err: any) {
        // Ignore token refresh errors as they don't affect functionality
        if (err.code !== "auth/network-request-failed") {
          console.error("Verification check error:", err);
        }
      }
    };

    checkVerification();
  }, [user, router, newEmail]);

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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Don't render anything if we're loading or redirecting
  if (isLoading || !user) {
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
            Please verify your email address to continue using the app.
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

        {!user.emailVerified && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-6 p-8 bg-[var(--primary-light-gray)]/10 rounded-lg border border-[var(--primary-gray)]/20">
              <div className="w-20 h-20 rounded-full bg-[var(--primary-gray)]/20 flex items-center justify-center">
                <Mail className="w-10 h-10 text-[var(--primary-white)]" />
              </div>
              <div className="flex flex-col gap-3 text-center">
                <h2 className="text-xl font-semibold text-[var(--primary-white)]">
                  Check your email
                </h2>
                <p className="text-[var(--primary-gray)] text-lg">
                  We've sent a verification link to{" "}
                  <span className="text-[var(--primary-white)] font-medium">
                    {user.email}
                  </span>
                </p>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={isSending}
                className="button text-[var(--primary-white)] w-full"
              >
                {isSending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="button button--secondary text-[var(--primary-white)] border border-[var(--primary-gray)]/20 w-full"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
