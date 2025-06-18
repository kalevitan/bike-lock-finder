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
    <div className="w-full md:max-w-2xl md:mx-auto">
      <div className="flex flex-col gap-6">
        {/* Feedback Messages */}
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

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--primary-light-gray)]/10 p-8 rounded-lg border border-[var(--primary-gray)]/20">
          {/* Profile Image */}
          <div className="relative min-w-[150px] min-h-[150px]">
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
              width={150}
              height={150}
              className="w-[150px] h-[150px] object-cover rounded-full border border-[var(--primary-gray)]"
            />
            {isEditing && (
              <label
                htmlFor="file-image"
                className="absolute bottom-0 right-0 bg-[var(--primary-white)] text-black p-2 rounded-full cursor-pointer hover:bg-gray-200"
              >
                <Camera size={20} />
              </label>
            )}
          </div>

          {/* User Info & Actions */}
          <div className="flex flex-col gap-4 w-full md:flex-grow">
            <div className="flex flex-col gap-3 text-center md:text-left">
              {isEditing ? (
                <input
                  ref={displayNameInputRef}
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b-2 border-[var(--primary-gray)] focus:outline focus:border-[var(--primary-white)] text-[var(--primary-white)]"
                />
              ) : (
                <h1 className="text-3xl font-bold text-[var(--primary-white)]">
                  {userData.displayName}
                </h1>
              )}

              <p className="text-lg text-[var(--primary-white)]">
                {userData.email}
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-[var(--primary-white)]">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span className="text-sm">Verified Member</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--primary-white)]">
                  <Trophy size={18} className="text-[var(--primary-gold)]" />
                  <span className="text-sm">
                    {userData.contributions || 0} Contributions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex flex-col justify-center md:flex-row gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="button button--primary flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="button button--secondary flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="button button--secondary flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="button button--danger flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
