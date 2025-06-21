import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "./firebase";
import imageCompression from "browser-image-compression";

const validateFile = (file: File): string | null => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return "Please upload a valid image file (JPEG, PNG, WebP, or HEIC)";
  }

  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return "Image size must be less than 10MB";
  }

  return null;
};

const compressImage = async (file: File): Promise<File> => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.8,
      // Force JPEG output for better compatibility
      fileType: "image/jpeg",
    };

    const compressedFile = await imageCompression(file, options);
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Ensure the output is always JPEG for consistency
    const finalFilename = sanitizedFilename.replace(
      /\.(heic|heif|png|webp)$/i,
      ".jpg"
    );

    return new File([compressedFile], finalFilename, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Failed to process image. Please try a different photo.");
  }
};

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      // Cloud storage is setting improper metadata, so we need to manually set the content type in order to make it cacheable
      const metadata = {
        contentType: file.type,
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          reject(new Error("Failed to upload image. Please try again."));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (!downloadURL.startsWith("http")) {
              reject(new Error("Invalid download URL"));
            } else {
              resolve(downloadURL);
            }
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(new Error("Failed to complete upload. Please try again."));
          }
        }
      );
    } catch (err) {
      console.error("Unexpected upload error:", err);
      reject(new Error("Failed to upload image. Please try again."));
    }
  });
};

export const uploadAndCompressImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    // First, check if the user is authenticated according to Firebase
    if (!auth.currentUser) {
      throw new Error(
        "You must be logged in to upload images. Please refresh the page and try again."
      );
    }

    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const compressedFile = await compressImage(file);
    return uploadImage(compressedFile, path);
  } catch (error) {
    console.error("Upload and compress failed:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload image. Please try again.");
  }
};
