'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";
import { useUserDocument, updateUserDocument } from "@/lib/users";
import { uploadAndCompressImage } from "@/lib/storage";
import Image from "next/image";
import { ImagePlus, Trophy } from "lucide-react";

export default function AccountPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { userData, isLoading: userLoading, mutate } = useUserDocument(user?.uid || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if auth is done loading and there's no user
    if (!authLoading && !user) {
      // Use setTimeout to ensure the redirect happens after the current render cycle
      setTimeout(() => {
        redirect('/login');
      }, 0);
    }
  }, [authLoading, user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      const success = await signOut();
      if (!success) {
        throw new Error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get('photoURL') as File;
      let photoURL = userData?.photoURL;

      if (file && file.size > 0) {
        setIsUploadingImage(true);
        try {
          photoURL = await uploadAndCompressImage(file, 'profiles');
        } finally {
          setIsUploadingImage(false);
        }
      }

      const updateData = {
        displayName: formData.get('displayName') as string,
        email: formData.get('email') as string,
        photoURL,
        updatedAt: new Date().toISOString()
      };

      const success = await updateUserDocument(user.uid, updateData);
      if (success) {
        await mutate();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
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

  // Show loading state while auth or user data is loading
  if (authLoading || userLoading) {
    return <Loading />;
  }

  // Don't render anything if we're not authenticated (will redirect)
  if (!user || !userData) {
    return null;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-4">
        {(previewUrl || userData.photoURL) ? (
          <div className="relative m-auto overflow-hidden cursor-pointer hover:opacity-70 transition-opacity duration-300">
            <Image
              src={previewUrl || userData.photoURL || ''}
              alt="Preview"
              width={150}
              height={150}
              className="w-[150px] h-[150px] object-cover rounded-full border border-[#6b7280]"
              onClick={() => {
                document.getElementById('photoURL')?.click();
              }}
            />
            {isUploadingImage && (
              <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-full">
                <div className="text-[var(--primary-white)]">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col text-left">
            <label htmlFor="photoURL" className="mb-2 text-[var(--primary-white)]">Profile Picture</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById('photoURL')?.click()}
                className="w-[150px] h-[150px] border rounded-full flex items-center justify-center cursor-pointer border-[#6b7280] hover:opacity-70 transition-opacity duration-300"
              >
                <ImagePlus color="#6b7280" size={32}/>
              </button>
            </div>
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center">Hi, {userData.displayName || userData.email} 👋</h1>
        <div className="flex gap-2 items-center justify-center text-center text-sm text-[var(--primary-light-gray)]">
          <span className="flex items-center gap-2 text-sm text-gray-400 font-light bg-[var(--primary-light-gray)] px-2 py-1 rounded-md"><Trophy size={12} color={"var(--primary-gold)"}/>{25} contributions</span>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleUserUpdate}>
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-[var(--primary-white)]">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={userData.displayName}
              className="rounded-[0.25rem]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[var(--primary-white)]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="rounded-[0.25rem]"
              defaultValue={userData.email}
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
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md" role="alert">
              {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="button flex-1 text-[var(--primary-white)]"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              className="button button--secondary flex-1 text-[var(--primary-white)]"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}