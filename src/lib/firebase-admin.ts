import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Function to parse the base64-encoded service account
const getServiceAccount = () => {
  const base64 = process.env.SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error("SERVICE_ACCOUNT_BASE64 environment variable is not set.");
  }
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(decoded);
};

// Initialize Firebase Admin
let app;
if (getApps().length === 0) {
  try {
    app = initializeApp({
      credential: cert(getServiceAccount()),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
} else {
  app = getApps()[0];
}

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb };
