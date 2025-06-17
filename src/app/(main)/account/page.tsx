"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { uploadAndCompressImage } from "@/lib/storage";
import Loading from "@/app/loading";
import Image from "next/image";
import { SquareUser, Trophy } from "lucide-react";
import { getUserDocument, updateUserDocument } from "@/lib/users";
import type { UserData } from "@/lib/users";
import { Camera, Check, Edit, LogOut, ShieldCheck, X } from "lucide-react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

function NameSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2"></div>
      <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
    </div>
  );
}

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    console.log("AccountPage: useEffect triggered.", {
      authLoading,
      user: {
        uid: user?.uid,
        emailVerified: user?.emailVerified,
      },
    });
    // Redirect unauthenticated users
    if (!authLoading && !user) {
      console.log("AccountPage: No user found, redirecting to /login.");
      router.push("/login");
      return;
    }

    // Redirect unverified users
    if (user && !user.emailVerified) {
      console.log(
        "AccountPage: User not verified, redirecting to /verify-email."
      );
      router.push("/verify-email");
      return;
    }

    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const data = await getUserDocument(user.uid);
          setUserData(data);
          setDisplayName(data?.displayName || "");
          setFormData({
            displayName: data?.displayName || "",
          });
        } catch (error) {
          console.error("Failed to fetch user document:", error);
          setError("Failed to load profile. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user || !userData) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updates: Partial<UserData> = {
        updatedAt: new Date().toISOString(),
      };

      // Handle display name update
      if (formData.displayName !== userData.displayName) {
        await updateProfile(user, {
          displayName: formData.displayName,
        });
        updates.displayName = formData.displayName;
      }

      // Update Firestore
      await updateUserDocument(user.uid, updates);

      // Update local state
      setUserData((prev) => (prev ? { ...prev, ...updates } : null));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing && e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        const photoURL = await uploadAndCompressImage(
          file,
          `profile-images/${user?.uid}`
        );
        if (user && userData) {
          await updateUserDocument(user.uid, { ...userData, photoURL });
          setUserData({ ...userData, photoURL });
          setSuccess("Profile picture updated!");
        }
      } catch (err) {
        setError("Failed to upload image. Please try again.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (authLoading || isLoading || !user) {
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
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-6">
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

        <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--primary-light-gray)]/10 p-8 rounded-lg border border-[var(--primary-gray)]/20">
          <div className="relative">
            <input
              type="file"
              id="file-image"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={!isEditing}
            />
            <Image
              src={userData.photoURL || "/images/user-placeholder.png"}
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
          <div className="flex flex-col gap-3 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-[var(--primary-gray)] focus:outline-none focus:border-[var(--primary-white)] text-[var(--primary-white)]"
              />
            ) : (
              <h1 className="text-3xl font-bold text-[var(--primary-white)]">
                {userData.displayName}
              </h1>
            )}

            <p className="text-lg text-[var(--primary-gray)]">
              {userData.email}
            </p>
            <div className="flex items-center gap-2 justify-center md:justify-start text-[var(--primary-gray)]">
              <ShieldCheck size={20} className="text-green-500" />
              <span>Verified Member</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start text-[var(--primary-gray)]">
              <Trophy size={20} />
              <span>0 Contributions</span>
            </div>
          </div>
          <div className="md:ml-auto flex flex-col md:flex-row gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="button button--secondary flex items-center gap-2"
                >
                  <Check size={20} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="button button--secondary flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="button button--secondary flex items-center gap-2"
              >
                <Edit size={20} />
                Edit Profile
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="button button--secondary flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
