import { useState, useEffect } from "react";
import type { UserData } from "@/interfaces/user";

export async function getUserDocument(uid: string): Promise<UserData | null> {
  if (!uid) return null;
  try {
    const response = await fetch(`/api/users?uid=${uid}`, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("No user document found for UID:", uid);
        return null;
      }
      throw new Error(`Failed to fetch user document: ${response.status}`);
    }

    const userData = await response.json();
    return userData as UserData;
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
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, ...data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user document");
    }
  } catch (error) {
    console.error("Error updating user document:", error);
    throw new Error("Failed to update user profile");
  }
}

export async function incrementUserContributions(uid: string): Promise<void> {
  try {
    const response = await fetch("/api/users/increment-contributions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to increment contributions");
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

    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await getUserDocument(uid);

        if (isMounted) {
          if (data) {
            setUserData(data);
          } else {
            console.warn("No user document found for UID:", uid);
            setUserData(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in useUserDocument:", error);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [uid]);

  return { userData, isLoading, isError };
}
