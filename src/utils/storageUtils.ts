/**
 * Transforms a private Firebase Storage URL (with token) into a public,
 * cacheable URL for Google Cloud Storage.
 *
 * @param firebasePrivateUrl The private URL from Firebase Storage.
 * @returns The public, token-less URL.
 *
 * @example
 * // returns 'https://storage.googleapis.com/your-bucket.appspot.com/images/file.jpg'
 * getPublicUrl('https://firebasestorage.googleapis.com/v0/b/your-bucket.appspot.com/o/images%2Ffile.jpg?alt=media&token=...')
 */
export const getPublicUrl = (firebasePrivateUrl: string): string => {
  try {
    const url = new URL(firebasePrivateUrl);
    const pathParts = url.pathname.split("/");

    // The pathname is like /v0/b/your-bucket.appspot.com/o/path%2Fto%2Ffile.jpg
    const bucketName = pathParts[3];
    const encodedFilePath = pathParts.slice(5).join("/");
    const filePath = decodeURIComponent(encodedFilePath);

    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
  } catch (error) {
    console.error(
      "Failed to parse Firebase Storage URL:",
      error,
      firebasePrivateUrl
    );
    // Return the original URL as a fallback to avoid crashing
    return firebasePrivateUrl;
  }
};
