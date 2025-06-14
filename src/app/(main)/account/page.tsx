"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loading from "@/app/loading";
import Image from "next/image";
import { SquareUser, Trophy } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if auth is done loading and there's no user
    if (!authLoading && !user) {
      // Use setTimeout to ensure the redirect happens after the current render cycle
      setTimeout(() => {
        redirect("/login");
      }, 0);
    }
  }, [authLoading, user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setFormData({
            displayName: data.displayName || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      await updateDoc(doc(db, "users", user.uid), updates);

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
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {previewUrl || userData?.photoURL ? (
          <div className="relative m-auto overflow-hidden cursor-pointer hover:opacity-70 transition-opacity duration-300">
            <Image
              src={previewUrl || userData?.photoURL || ""}
              alt="Preview"
              width={150}
              height={150}
              className="w-[150px] h-[150px] object-cover rounded-full border border-[#6b7280]"
              onClick={() => {
                document.getElementById("photoURL")?.click();
              }}
            />
            {isUploadingImage && (
              <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-full">
                <div className="text-[var(--primary-white)]">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById("photoURL")?.click()}
                className="w-[150px] h-[150px] border rounded-full flex items-center justify-center cursor-pointer border-[#6b7280] hover:opacity-70 transition-opacity duration-300"
              >
                <SquareUser color="#6b7280" size={60} />
              </button>
            </div>
            <label htmlFor="photoURL" className="text-[var(--primary-white)]">
              Profile Picture
            </label>
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center">
          Hi, {userData?.displayName || userData?.email} 👋
        </h1>

        <div className="flex gap-2 items-center justify-center text-center text-sm text-[var(--primary-light-gray)]">
          <span className="flex items-center gap-2 text-sm text-gray-400 font-light bg-[var(--primary-light-gray)] px-2 py-1 rounded-md">
            <Trophy size={12} color={"var(--primary-gold)"} />
            {25} contributions
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="displayName"
              className="text-[var(--primary-white)]"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="rounded-[0.25rem]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[var(--primary-white)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userData?.email || user?.email || ""}
              disabled
              className={`rounded-[0.25rem] bg-gray-50 ${
                isEditing ? "cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              id="photoURL"
              name="photoURL"
              accept="image/*"
              hidden={true}
              onChange={handleFileSelect}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="button flex-1 text-[var(--primary-white)]"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="button flex-1 text-[var(--primary-white)]"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      displayName: userData?.displayName || "",
                    });
                  }}
                  className="button button--secondary flex-1 text-[var(--primary-white)]"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="button button--secondary flex-1 text-[var(--primary-white)]"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
