"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { getUserDocument, updateUserDocument } from "@/lib/users";
import type { UserData } from "@/interfaces/user";
import { uploadAndCompressImage } from "@/lib/storage";
import Loading from "@/app/loading";
import Image from "next/image";
import {
  Camera,
  Check,
  Edit,
  LogOut,
  ShieldCheck,
  Trophy,
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  Calendar,
} from "lucide-react";

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Component State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI Feedback State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Ref for the display name input
  const displayNameInputRef = useRef<HTMLInputElement>(null);

  // Fetch User Data
  useEffect(() => {
    // Wait until auth is resolved before doing anything
    if (authLoading) {
      return;
    }

    // If no user, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // If user is not verified, redirect to verify page
    if (!user.emailVerified) {
      router.push("/verify-email");
      return;
    }

    // If we have a verified user, fetch their document
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserDocument(user.uid);
        if (data) {
          setUserData(data);
          setDisplayName(data.displayName || "");
        } else {
          // This case might happen if Firestore doc creation failed
          setError("Could not find user profile. Please contact support.");
        }
      } catch (error) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading, router]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && displayNameInputRef.current) {
      displayNameInputRef.current.focus();
    }
  }, [isEditing]);

  // Cleanup for image preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handlers
  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Set preview
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const photoURL = await uploadAndCompressImage(
        file,
        `profile-images/${user.uid}`
      );
      if (userData) {
        await updateUserDocument(user.uid, { ...userData, photoURL });
        setUserData((prev) => (prev ? { ...prev, photoURL } : null));
        setSuccess("Profile picture updated!");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    }
  };

  const handleUpdate = async () => {
    if (!user || !userData) return;

    // Prevent saving if display name hasn't changed
    if (displayName === userData.displayName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserDocument(user.uid, { displayName });
      setUserData((prev) => (prev ? { ...prev, displayName } : null));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setDisplayName(userData.displayName || "");
    }
  };

  // Render Logic
  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!userData) {
    return (
      <div className="text-center text-[var(--primary-white)]">
        Could not load user profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)] pt-20 px-4 pb-8">
      <div className="max-w-xl mx-auto">
        {/* Feedback Messages */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary-white)] mb-2">
            My Account
          </h1>
          <p className="text-[var(--primary-white)]/70 text-sm">
            Manage your profile and contributions
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[var(--primary-white)] rounded-2xl shadow-2xl border border-[var(--steel-blue)]/20 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 text-center">
            {/* Profile Image */}
            <div className="relative inline-block mb-4">
              <input
                type="file"
                id="file-image"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={!isEditing}
              />
              <Image
                src={
                  previewUrl ||
                  userData.photoURL ||
                  "/images/user-placeholder.png"
                }
                alt="Profile Picture"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-cover rounded-full border-4 border-[var(--steel-blue)]/20 shadow-lg"
              />
              {isEditing && (
                <label
                  htmlFor="file-image"
                  className="absolute -bottom-1 -right-1 bg-[var(--primary-purple)] text-white p-2.5 rounded-full cursor-pointer hover:bg-[var(--deep-purple)] transition-colors duration-200 shadow-lg"
                >
                  <Camera size={14} />
                </label>
              )}
            </div>

            {/* Display Name */}
            {isEditing ? (
              <div className="mb-3">
                <input
                  ref={displayNameInputRef}
                  type="text"
                  name="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-center text-2xl font-bold bg-transparent border-b-2 w-full border-gray-200 focus:border-[var(--primary-purple)] focus:outline-none transition-colors duration-200 text-[var(--primary-gray)] px-4 py-2"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-[var(--primary-gray)] mb-3">
                {userData.displayName}
              </h1>
            )}

            {/* Email */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail size={14} className="text-[var(--primary-gray)]/60" />
              <p className="text-[var(--primary-gray)] text-sm">
                {userData.email}
              </p>
            </div>

            {/* Stats Badges */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                <ShieldCheck size={16} className="text-green-600" />
                <span className="text-xs font-semibold text-green-800">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary-gold)]/20 to-[var(--accent-mint)]/20 px-4 py-2.5 rounded-full border border-[var(--primary-gold)]/30 shadow-sm">
                <Trophy size={18} className="text-[var(--primary-gold)]" />
                <span className="text-sm font-bold text-[var(--primary-white)]">
                  {userData.contributions || 0} Contributions
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0 space-y-3">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
                >
                  <Check size={16} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-[var(--primary-gray)] font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[var(--primary-white)] text-[var(--primary-purple)] font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 border-2 border-[var(--primary-purple)] transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Member footer */}
        <div className="text-center mt-6">
          <p className="flex items-center justify-center text-[var(--primary-white)]/50 text-xs">
            <Calendar size={12} />
            <span className="ml-1">
              Member since {new Date(userData.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
