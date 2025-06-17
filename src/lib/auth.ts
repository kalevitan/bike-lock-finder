import { NextResponse } from "next/server";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

interface UserDocument {
  email: string;
  displayName: string;
  createdAt: string;
  photoURL?: string;
  emailVerified: boolean;
}

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
    const userDoc: {
      uid: string;
      email: string;
      displayName: string;
      createdAt: string;
      updatedAt: string;
      emailVerified: boolean;
      photoURL?: string;
    } = {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: userData.createdAt,
      updatedAt: new Date().toISOString(),
      emailVerified: true,
    };

    // Only add photoURL if it exists
    if (userData.photoURL) {
      userDoc.photoURL = userData.photoURL;
    }

    // Use setDoc with the user's UID as the document ID
    await setDoc(doc(db, "users", uid), userDoc);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Failed to create user profile");
  }
}
