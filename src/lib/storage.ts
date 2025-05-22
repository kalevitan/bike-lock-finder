import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
    if (!file) {
      throw new Error('No file provided');
    }

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `images/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null, // optional progress function
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