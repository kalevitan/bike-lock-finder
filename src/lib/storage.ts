import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a unique filename using timestamp and original filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Create a reference to the file location
    const storageRef = ref(storage, `images/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};