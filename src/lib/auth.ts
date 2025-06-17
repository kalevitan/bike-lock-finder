import { NextResponse } from "next/server";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (user) {
      return NextResponse.json({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
      });
    }
  } catch (error: any) {
    return NextResponse.json("Error signing in", error);
  }
};

interface PendingRegistration {
  email: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}

interface UserDocument {
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export async function createPendingRegistration(
  email: string
): Promise<{ token: string; isReverification: boolean }> {
  // Check if email already exists in pending registrations
  const pendingQuery = query(
    collection(db, "pendingRegistrations"),
    where("email", "==", email)
  );
  const pendingSnapshot = await getDocs(pendingQuery);

  let token: string;
  let isReverification = false;

  if (!pendingSnapshot.empty) {
    console.log("Found existing pending registration, updating...");
    // Update existing pending registration
    const pendingDoc = pendingSnapshot.docs[0];
    const pendingData = pendingDoc.data() as PendingRegistration;
    token = pendingData.token;
    isReverification = true;

    // Update expiration time
    await updateDoc(doc(db, "pendingRegistrations", pendingDoc.id), {
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  } else {
    console.log("Creating new pending registration...");
    // Create new pending registration
    token = uuidv4();
    await addDoc(collection(db, "pendingRegistrations"), {
      email,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  }

  return { token, isReverification };
}

export async function verifyPendingRegistration(
  token: string
): Promise<string> {
  // Find the pending registration with the given token
  const pendingQuery = query(
    collection(db, "pendingRegistrations"),
    where("token", "==", token)
  );
  const pendingSnapshot = await getDocs(pendingQuery);

  if (pendingSnapshot.empty) {
    throw new Error("Invalid or expired verification link");
  }

  const pendingDoc = pendingSnapshot.docs[0];
  const pendingData = pendingDoc.data() as PendingRegistration;

  // Check if the token has expired
  const expiresAt = new Date(pendingData.expiresAt);
  if (expiresAt < new Date()) {
    // Delete expired registration
    await deleteDoc(doc(db, "pendingRegistrations", pendingDoc.id));
    throw new Error("Verification link has expired");
  }

  // Delete the pending registration
  await deleteDoc(doc(db, "pendingRegistrations", pendingDoc.id));

  return pendingData.email;
}

export const signOut = async () => {
  try {
    await auth.signOut();
    // Wait a moment to ensure the auth state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

export async function createUserDocument(
  uid: string,
  userData: UserDocument
): Promise<void> {
  try {
    await addDoc(collection(db, "users"), {
      uid,
      ...userData,
      updatedAt: new Date().toISOString(),
      emailVerified: true,
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Failed to create user profile");
  }
}
