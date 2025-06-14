"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { createUserDocument } from "@/lib/users";
import Loading from "@/app/loading";
import { useModal } from "@/contexts/ModalProvider";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState("login");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/account");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formMode === "register") {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Set display name in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });

        // Send verification email
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verificationError: any) {
          console.error("Error sending verification email:", verificationError);
        }

        // Create user document in Firestore
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: displayName,
          photoURL: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: false,
        };

        const success = await createUserDocument(userData);
        if (!success) {
          throw new Error("Failed to create user profile");
        }

        // Show success message and redirect to login
        setError(null);
        setFormMode("login");
        setEmail("");
        setPassword("");
        setDisplayName("");
        openModal(
          <div className="flex flex-col items-center gap-6 p-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex flex-col gap-3 text-center">
              <h3 className="text-xl font-semibold text-[var(--primary-gray)]">
                Registration Successful!
              </h3>
              <p className="text-[var(--primary-gray)]">
                Please check your email to verify your account. If you don't see
                the email, check your spam folder or request a new verification
                email from your account page.
              </p>
            </div>
            {/* <div className="flex flex-col gap-3 w-full">
              <button
                className="button text-[var(--primary-white)] w-full"
                onClick={() => router.push("/account")}
                type="button"
              >
                Go to account page
              </button>
            </div> */}
          </div>,
          ""
        );
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          setError(
            "This email is already registered. Please try logging in instead."
          );
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak. Please use a stronger password.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else {
          setError(err.message);
        }
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
        // Send verification email if not verified
        await sendEmailVerification(userCredential.user);
        // Sign out the user since they're not verified
        await signOut(auth);
        setError(
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
        return;
      }

      router.push("/account");
    } catch (err: any) {
      // Clear any existing error first
      setError(null);

      // Handle specific Firebase error codes
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later or reset your password."
          );
          break;
        case "auth/user-disabled":
          setError("This account has been disabled. Please contact support.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("An error occurred during login. Please try again.");
      }
      return;
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return <Loading />;
  }

  // Don't render anything if we're authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight pb-6">
          {formMode === "login" ? "Login" : "Sign up"}
        </h1>

        <form method="post" onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {formMode === "register" && (
              <div className="flex flex-col text-left gap-2">
                <label
                  htmlFor="displayName"
                  className="text-[var(--primary-white)]"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-[4px]"
                  placeholder="Enter your name"
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
            >
              {formMode === "login" ? "Login" : "Sign up"}
            </button>
          </div>
          <div className="pt-6 pb-4 text-center text-[var(--primary-white)]">
            {formMode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setFormMode("register");
                  setError(null);
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
