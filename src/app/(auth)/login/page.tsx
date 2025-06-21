"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import Loading from "@/app/loading";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createUserDocument } from "@/lib/users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formMode, setFormMode] = useState("login"); // "login", "register", "reset-password"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent. Please check your inbox.");
      setFormMode("login");
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordValidation = async () => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const lengthRegex = /^.{8,}$/;

    if (!uppercaseRegex.test(password)) {
      setError("Password must contain at least one uppercase character.");
    } else if (!lowercaseRegex.test(password)) {
      setError("Password must contain at least one lowercase character.");
    } else if (!specialCharRegex.test(password)) {
      setError("Password must contain at least one special character.");
    } else if (!lengthRegex.test(password)) {
      setError("Password must be at least 8 characters long.");
    }
  };

  useEffect(() => {
    // Check for message in URL
    const message = searchParams?.get("message");
    if (message) {
      setError(decodeURIComponent(message));
    }
  }, [searchParams]);

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (!authLoading && user && user.emailVerified) {
      router.push("/account");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (formMode === "reset-password") {
      await handlePasswordReset();
      setIsSubmitting(false);
      return;
    }

    if (formMode === "register") {
      try {
        // 1. Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUser = userCredential.user;

        // 2. Update user's profile with display name
        await updateProfile(newUser, { displayName });

        // 3. Send Firebase verification email
        await sendEmailVerification(newUser);

        // 4. Create user document in Firestore
        await createUserDocument({
          uid: newUser.uid,
          email,
          displayName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          photoURL: "",
          contributions: 0,
        });

        // 5. Sign the user out to force them to verify
        await signOut(auth);

        // 6. Show success message
        setFormMode("login");
        setEmail("");
        setPassword("");
        setDisplayName("");
        setSuccess(
          "Registration successful! Please check your email to verify your account before logging in."
        );
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          setError("An account with this email already exists. Please log in.");
          setFormMode("login");
        } else {
          setError(err.message || "Failed to create account.");
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Login flow
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if user is verified
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError(
          "Your email is not verified. Please check your inbox for the verification link."
        );
        return;
      }

      router.push("/account");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (user && user.emailVerified) {
    return null; // Will be redirected by useEffect
  }

  const getTitle = () => {
    if (formMode === "register") return "Create an Account";
    if (formMode === "reset-password") return "Reset Your Password";
    return "Login";
  };

  const getButtonText = () => {
    if (isSubmitting) return "Please wait...";
    if (formMode === "register") return "Create Account";
    if (formMode === "reset-password") return "Send Reset Link";
    return "Login";
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-md">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-[var(--primary-white)] text-xl font-light leading-relaxed">
            Find and share secure places
            <br />
            to lock your bike
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-[var(--primary-white)] rounded-2xl shadow-2xl p-8 border border-[var(--steel-blue)]/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--primary-gray)] mb-2">
              {getTitle()}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] rounded-full mx-auto"></div>
          </div>

          <form method="post" onSubmit={handleSubmit} className="space-y-5">
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

            {/* Display Name Field */}
            {formMode === "register" && (
              <div className="space-y-2">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-semibold text-[var(--primary-gray)]"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your display name"
                  required
                />
              </div>
            )}

            {/* Reset Password Instructions */}
            {formMode === "reset-password" && (
              <div className="text-center p-4 bg-[var(--accent-mint)]/10 rounded-xl border border-[var(--accent-mint)]/20">
                <p className="text-[var(--primary-gray)] text-sm">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--primary-gray)]"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            {formMode !== "reset-password" && (
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--primary-gray)]"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                  required={formMode !== "reset-password"}
                />
              </div>
            )}

            {/* Forgot Password Link */}
            {formMode === "login" && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-[var(--primary-purple)] hover:text-[var(--deep-purple)] font-medium transition-colors duration-200"
                  onClick={() => {
                    setFormMode("reset-password");
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--deep-purple)] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {getButtonText()}
            </button>

            {/* Mode Switch */}
            <div className="text-center pt-4 border-t border-gray-100">
              {formMode === "login" ? (
                <p className="text-[var(--primary-gray)] text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-[var(--primary-purple)] hover:text-[var(--deep-purple)] font-semibold transition-colors duration-200"
                    onClick={() => {
                      setFormMode("register");
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    Sign up here
                  </button>
                </p>
              ) : (
                <p className="text-[var(--primary-gray)] text-sm">
                  {formMode === "register"
                    ? "Already have an account?"
                    : "Remember your password?"}{" "}
                  <button
                    type="button"
                    className="text-[var(--primary-purple)] hover:text-[var(--deep-purple)] font-semibold transition-colors duration-200"
                    onClick={() => {
                      setFormMode("login");
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    {formMode === "register" ? "Login here" : "Back to login"}
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
