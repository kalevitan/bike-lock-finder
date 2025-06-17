"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDocument } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";
import Loading from "@/app/loading";
import { UserPlus, CheckCircle2, AlertCircle, SquareUser } from "lucide-react";
import Image from "next/image";

export default function CompleteRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) {
      router.push("/login");
      return;
    }
    setEmail(email);
  }, [searchParams, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload profile image if selected
      let photoURL: string | null = null;
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          photoURL = await uploadImage(
            selectedFile,
            `profile-images/${userCredential.user.uid}`
          );
        } catch (error) {
          console.error("Error uploading profile image:", error);
          // Continue with registration even if image upload fails
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Update the user's profile with their display name and photo URL
      await updateProfile(userCredential.user, {
        displayName,
        photoURL: photoURL || undefined,
      });

      // Create the user document in Firestore
      await createUserDocument(userCredential.user.uid, {
        email,
        displayName,
        photoURL: photoURL || undefined,
        createdAt: new Date().toISOString(),
      });

      setSuccess("Account created successfully!");
      // Redirect to account page after a short delay
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating account:", err);
      if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return <Loading />;
  }

  return (
    <div className="w-full md:max-w-[26rem] md:mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-[var(--primary-white)]">
            Complete your registration
          </h1>
          <p className="text-[var(--primary-white)] text-lg">
            Please set up your account details to continue.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-center">
            {previewUrl ? (
              <div className="relative m-auto overflow-hidden cursor-pointer hover:opacity-70 transition-opacity duration-300">
                <Image
                  src={previewUrl}
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
                    <div className="text-[var(--primary-white)]">
                      Uploading...
                    </div>
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
                <label
                  htmlFor="photoURL"
                  className="text-[var(--primary-white)]"
                >
                  Profile Picture (Optional)
                </label>
              </div>
            )}
            <input
              type="file"
              id="photoURL"
              name="photoURL"
              accept="image/*"
              hidden={true}
              onChange={handleFileSelect}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="displayName"
              className="text-[var(--primary-white)] font-medium"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="input"
              placeholder="Enter your display name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[var(--primary-white)] font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="input bg-[var(--primary-light-gray)]/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[var(--primary-white)] font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="button text-[var(--primary-white)] w-full"
          >
            {isSubmitting ? (
              "Creating account..."
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
