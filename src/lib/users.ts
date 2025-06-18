import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserData } from "@/interfaces/user";

export async function getUserDocument(uid: string): Promise<UserData | null> {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserData;
    } else {
      console.warn("No user document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
}

export async function createUserDocument(userData: UserData): Promise<boolean> {
  if (!userData.uid) {
    throw new Error("User ID is required");
  }

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user document");
    }

    return true;
  } catch (error) {
    console.error("Error creating user document:", error);
    return false;
  }
}

export async function updateUserDocument(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user document:", error);
    throw new Error("Failed to update user profile");
  }
}

export async function incrementUserContributions(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentContributions = userDoc.data().contributions || 0;
      await updateDoc(userDocRef, {
        contributions: currentContributions + 1,
        updatedAt: serverTimestamp(),
      });
    } else {
      // If user doc somehow doesn't exist, create it with 1 contribution
      await setDoc(userDocRef, { contributions: 1 }, { merge: true });
    }
  } catch (error) {
    console.error("Error incrementing user contributions:", error);
    throw new Error("Failed to update contribution count");
  }
}

export function useUserDocument(uid: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userDocRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          console.warn("No user document found for UID:", uid);
          setUserData(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error in useUserDocument listener:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [uid]);

  return { userData, isLoading, isError };
}
