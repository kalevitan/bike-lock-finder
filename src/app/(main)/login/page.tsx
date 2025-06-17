"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import Loading from "@/app/loading";
import { useModal } from "@/contexts/ModalProvider";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createUserDocument } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formMode, setFormMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();

  useEffect(() => {
    // Check for message in URL
    const message = searchParams.get("message");
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
        await createUserDocument(newUser.uid, {
          email,
          displayName,
          createdAt: new Date().toISOString(),
          emailVerified: false, // Set to false initially
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

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight pb-6">
          {formMode === "login" ? "Login" : "Create an Account"}
        </h1>

        <form method="post" onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {formMode === "register" && (
              <div className="flex flex-col text-left gap-2">
                <label
                  htmlFor="displayName"
                  className="text-[var(--primary-white)]"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-[4px]"
                  placeholder="Enter your display name"
                  required
                />
              </div>
            )}

            <div className="flex flex-col text-left gap-2">
              <label htmlFor="email" className="text-[var(--primary-white)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-[4px]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col text-left gap-2">
              <label htmlFor="password" className="text-[var(--primary-white)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-[4px]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              className="button mt-6 text-[var(--primary-white)]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : formMode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>
          </div>
          <div className="pt-6 pb-4 text-center text-[var(--primary-white)]">
            {formMode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setFormMode("register");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Don't have an account? Sign up here.
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormMode("login");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Already have an account? Login here.
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
