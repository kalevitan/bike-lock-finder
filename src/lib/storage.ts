import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';
import imageCompression from 'browser-image-compression';

const storage = getStorage(app);

const validateFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, or WebP)';
  }

  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return 'Image size must be less than 10MB';
  }

  return null;
};

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  const compressedFile = await imageCompression(file, options);
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

  return new File([compressedFile], sanitizedFilename, {
    type: file.type,
    lastModified: file.lastModified,
  });
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (!downloadURL.startsWith('http')) {
            reject(new Error('Invalid download URL'));
          } else {
            resolve(downloadURL);
          }
        }
      );
    } catch (err) {
      console.error('Unexpected upload error:', err);
      reject(err);
    }
  });
};

export const uploadAndCompressImage = async (file: File, path: string): Promise<string> => {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const compressedFile = await compressImage(file);
  return uploadImage(compressedFile, path);
};