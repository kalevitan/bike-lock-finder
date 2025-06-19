import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAnalytics } from "firebase/analytics";

// Helper function to get environment variables and throw a clear error if they are missing
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // This error will be thrown both on the server and in the browser console
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Explicitly type the environment variables
const firebaseConfig = {
  apiKey: getEnvVar("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnvVar("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: getEnvVar("NEXT_PUBLIC_GA_ID"),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Initialize App Check
if (typeof window !== "undefined") {
  try {
    // Allows logging of the debug token to the console
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        getEnvVar("NEXT_PUBLIC_RECAPTCHA_SITE_KEY")
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Error initializing App Check:", error);
  }
}
